<script setup lang="ts">
import type { VariantInterface } from "~~/types/concertVariantsTypes";
import type { ConcertVariantInterface, Meta } from "~~/types/concertVariantTypes";
import { ref, watch } from "vue";
import { useVariantDetail } from "~~/composables/useEvent";
import { fetchSeatData } from "~~/composables/useVariantSeatSocket";
import type { AvailableSeatDataObj, Seat } from "~~/types/concertSeatTypes";

// Props
const props = defineProps<{
  concertId: number;
  variants: VariantInterface[];
  isOpen: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "select-variant",
    payload: { variantId: number; quantity: number; selectedSeats?: Seat[] }
  ): void;
}>();

// State for quantity selection per variant
const quantities = ref<Record<number, number>>({});
const isSeatMapOpen = ref(false);
const seatData = ref<AvailableSeatDataObj | null>(null);
const variantMeta = ref<Meta | null>(null);
const selectedVariantId = ref<number | null>(null);
const seatError = ref<string | null>(null);
const variantInfo = ref<ConcertVariantInterface | null>(null);

// Watch for variants change to initialize quantities
watch(
  () => props.variants,
  (newVariants) => {
    quantities.value = Object.fromEntries(
      newVariants.map((variant) => [variant.id, variant.allow_order_min || 1])
    );
  },
  { immediate: true }
);

// Handle quantity change
const updateQuantity = (variantId: number, delta: number) => {
  const variant = props.variants.find((v) => v.id === variantId);
  if (!variant) return;

  const current = quantities.value[variantId] || variant.allow_order_min || 1;
  const newQuantity = current + delta;

  // Enforce min/max constraints
  if (
    newQuantity >= (variant.allow_order_min || 1) &&
    newQuantity <= (variant.allow_order_max || Infinity) &&
    newQuantity <= variant.stock
  ) {
    quantities.value[variantId] = newQuantity;
  }
};

// Handle variant selection
const selectVariant = async (variantId: number) => {
  const { data, error, pending } = await useVariantDetail(props.concertId, variantId);
  variantInfo.value = data.value?.data ?? null;
  const quantity = quantities.value[variantId] || 1;
  if (variantInfo.value?.meta !== null && variantInfo.value?.special_option) {
    try {
      const fetchedSeatData = await fetchSeatData(
        variantInfo.value.product_id,
        variantInfo.value.id
      );
      let parsedMeta: Meta | null = null;
      if (typeof variantInfo.value.meta === "string") {
        try {
          parsedMeta = JSON.parse(variantInfo.value.meta) as Meta;
        } catch (e) {
          console.error("Failed to parse meta JSON:", e);
          seatError.value = "Invalid seat map data";
          emit("select-variant", { variantId, quantity });
          return;
        }
      } else {
        parsedMeta = variantInfo.value.meta;
      }
      seatData.value = fetchedSeatData;
      variantMeta.value = parsedMeta;
      selectedVariantId.value = variantId;
      isSeatMapOpen.value = true;
    } catch (err) {
      console.error("Failed to fetch seat data:", err);
      seatError.value = "Failed to fetch seat data";
      emit("select-variant", { variantId, quantity });
    }
  } else {
    emit("select-variant", { variantId, quantity });
  }
};
// Handle seat selection
const handleSeatSelection = (selectedSeats: Seat[]) => {
  if (selectedSeats.length > 0 && selectedVariantId.value) {
    emit("select-variant", {
      variantId: selectedVariantId.value,
      quantity: quantities.value[selectedVariantId.value] || 1,
      selectedSeats,
    });
    isSeatMapOpen.value = false;
  }
};

// Close seat map
const closeSeatMap = () => {
  isSeatMapOpen.value = false;
  seatData.value = null;
  variantMeta.value = null;
  selectedVariantId.value = null;
  seatError.value = null;
};
</script>

<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-charcoal bg-opacity-80 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @click.self="emit('close')"
  >
    <!-- Modal Content -->
    <div class="bg-charcoal border-8 border-muted-white w-full max-w-2xl p-8 relative">
      <!-- Close Button -->
      <button
        class="absolute top-0 right-0 bg-neon-red text-charcoal p-2 text-lg uppercase font-bold border-b-4 border-l-4 border-charcoal"
        @click="emit('close')"
        aria-label="Close modal"
      >
        <Icon name="mdi:close-thick" width="48" height="48" />
      </button>

      <!-- Title -->
      <h2
        id="modal-title"
        class="text-3xl uppercase font-bold border-b-4 border-olive-green mb-6 pb-2"
      >
        Select Tickets
      </h2>

      <!-- Variant List with Scroll -->
      <div class="max-h-[60vh] pr-4 overflow-y-auto space-y-4">
        <div
          v-for="variant in variants"
          :key="variant.id"
          class="border-4 border-muted-white p-4"
          :class="{ 'opacity-50': variant.soldout_status }"
        >
          <!-- Variant Info -->
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl uppercase font-bold">{{ variant.name }}</h3>
              <p class="text-lg">
                {{ variant.price_text }}
                <span v-if="variant.service.charge">
                  + {{ variant.service.fee_text }} fee
                </span>
              </p>
              <p
                class="text-sm"
                :class="variant.stock > 0 ? 'text-olive-green' : 'text-neon-red'"
              >
                {{ variant.stock > 0 ? `${variant.stock} available` : "Sold Out" }}
              </p>
            </div>

            <!-- Quantity Selector -->
            <div
              v-if="
                !variant.soldout_status && variant.stock > 0 && !variant.special_option
              "
              class="flex items-center space-x-2"
            >
              <button
                class="bg-charcoal border-2 border-muted-white px-3 py-1 text-lg"
                @click="updateQuantity(variant.id, -1)"
                :disabled="
                  (quantities[variant.id] ?? 1) <= (variant.allow_order_min || 1)
                "
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span class="text-lg w-12 text-center">{{ quantities[variant.id] }}</span>
              <button
                class="bg-charcoal border-2 border-muted-white px-3 py-1 text-lg"
                @click="updateQuantity(variant.id, 1)"
                :disabled="
                  (quantities[variant.id] ?? 1) >=
                  Math.min(variant.allow_order_max || Infinity, variant.stock)
                "
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <!-- Action Button -->
          <button
            v-if="!variant.soldout_status && variant.stock > 0"
            class="mt-4 w-full bg-neon-red text-charcoal py-2 uppercase font-bold border-4 border-charcoal hover:bg-olive-green transition-colors"
            @click="selectVariant(variant.id)"
          >
            <p>
              {{ variant.special_option ? "Select seats" : "Add to Cart" }}
            </p>
          </button>
          <div
            v-else
            class="mt-4 w-full bg-charcoal text-muted-white py-2 uppercase font-bold border-4 border-neon-red text-center opacity-50"
          >
            Sold Out
          </div>
        </div>

        <!-- No Variants -->
        <div
          v-if="!variants.length"
          class="text-lg uppercase border-4 border-neon-red p-4 text-center"
        >
          No Tickets Available
        </div>
      </div>
    </div>
  </div>
  <!-- Seat Map Modal -->
  <div
    v-if="isSeatMapOpen"
    class="fixed inset-0 w-screen h-screen bg-charcoal bg-opacity-80 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="seat-map-title"
    @click.self="closeSeatMap"
  >
    <div
      class="bg-charcoal border-8 border-muted-white w-full h-full flex flex-col p-8 relative"
    >
      <button
        class="absolute top-0 right-0 bg-neon-red text-charcoal p-2 text-lg uppercase font-bold border-b-4 border-l-4 border-charcoal"
        @click="closeSeatMap"
        aria-label="Close seat map"
      >
        <Icon name="mdi:close-thick" width="48" height="48" />
      </button>

      <h2
        id="seat-map-title"
        class="text-3xl uppercase font-bold border-b-4 border-olive-green mb-6 pb-2"
      >
        Select Seats
      </h2>

      <div
        v-if="seatError"
        class="text-lg uppercase border-4 border-neon-red p-4 text-center"
      >
        {{ seatError }}
      </div>

      <SeatMap
        v-if="seatData && variantMeta"
        :seat-data="seatData"
        :meta="variantMeta"
        :seatMin="variantInfo?.allow_order_min"
        :seatMax="variantInfo?.allow_order_max"
        @select-seats="handleSeatSelection"
      />

      <div
        v-if="seatData?.seatData.length === 0"
        class="text-lg uppercase border-4 border-neon-red p-4 text-center"
      >
        No Seats Available
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2,
h3,
p {
  word-break: break-word;
}
</style>
