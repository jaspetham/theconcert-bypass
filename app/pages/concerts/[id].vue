<script setup lang="ts">
import { useEventInfo, useEventRounds, useEventVariants } from "~~/composables/useEvent";
import type { ConcertInfo } from "~~/types/concertInfoTypes";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import TicketVariantModal from "~/components/TicketVariantModal.vue";
import type { VariantInterface } from "~~/types/concertVariantsTypes";
import type { Round } from "~~/types/concertRoundsTypes";
import type { selectedVariantPayload } from "~~/types/payloadTypes";

const concertId = Number(useRoute().params.id);
const { data, error, pending } = await useEventInfo(concertId);
// const concertInfo: ComputedRef<ConcertInfo[]> = computed(() => data.value?.data ?? null);
const concertInfo = ref<ConcertInfo | null>(null);
const isLoading = ref(true);
// Modal state
const isVariantModalOpen = ref(false);
const isRoundsModalOpen = ref(false);
const variants = ref<VariantInterface[]>([]);
const rounds = ref<Round[]>([]);

// Fetch tickets (variants or rounds)
const fetchTickets = async () => {
  // Try useEventVariants first
  let { data: variantsData, error: variantsError } = await useEventVariants(concertId);
  if (variantsError.value) {
    console.error("Failed to fetch variants:", variantsError.value);
    // Proceed to try rounds even if variants fail
  }

  // Check if variants exist
  const variantRecords = variantsData.value?.data.record || [];
  if (variantRecords.length > 0) {
    variants.value = variantRecords;
    isVariantModalOpen.value = true;
    return;
  }

  // If no variants, try useEventRounds
  const { data: roundsData, error: roundsError } = await useEventRounds(concertId);
  if (roundsError.value) {
    console.error("Failed to fetch rounds:", roundsError.value);
    return;
  }

  // Check if rounds exist
  const roundRecords = roundsData.value?.data.record || [];
  if (roundRecords.length > 0) {
    rounds.value = roundRecords;
    isRoundsModalOpen.value = true;
  } else {
    console.warn("No tickets available for this event.");
  }
};

// Fetch variants for a specific round
const fetchVariantsForRound = async (roundId: number) => {
  const { data: variantsData, error: variantsError } = await useEventVariants(roundId);
  if (variantsError.value) {
    console.error(`Failed to fetch variants for round ${roundId}:`, variantsError.value);
    return;
  }

  const variantRecords = variantsData.value?.data.record || [];
  if (variantRecords.length > 0) {
    variants.value = variantRecords;
    isRoundsModalOpen.value = false;
    isVariantModalOpen.value = true;
  } else {
    console.warn(`No variants available for round ${roundId}.`);
  }
};

// Handle variant selection
const handleVariantSelection = (payload: selectedVariantPayload) => {
  console.log("Selected variant and seats:", payload);
  isVariantModalOpen.value = false;
};

// Handle round selection
const handleRoundSelection = (roundId: number) => {
  fetchVariantsForRound(roundId);
};

onMounted(async () => {
  const { data, error } = await useEventInfo(concertId);
  concertInfo.value = data.value?.data ?? null;
  isLoading.value = false;
  // Watch isOpen to toggle body overflow
  watch(
    () => isRoundsModalOpen.value || isVariantModalOpen.value,
    (isOpen) => {
      document.body.style.overflow = isOpen ? "hidden" : "";
    },
    { immediate: true }
  );
});
</script>

<template>
  <div class="bg-charcoal text-muted-white font-mono">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-2xl uppercase border-4 border-neon-red p-4">Loading...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-xl uppercase border-4 border-neon-red p-4 bg-charcoal">
        Error: {{ error.message }}
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="concertInfo" class="container mx-auto py-8 px-4">
      <!-- Header Section -->
      <header class="relative mb-12">
        <h1
          class="text-4xl md:text-6xl uppercase font-bold border-b-4 border-neon-red pb-6 tracking-tight break-words"
        >
          {{ concertInfo.name.en || "Untitled Event" }}
        </h1>
        <div class="absolute -left-4 w-16 h-16 bg-olive-green opacity-50"></div>
      </header>

      <!-- Main Grid -->
      <div class="flex gap-12">
        <!-- Image Section -->
        <div class="relative border-4 border-muted-white">
          <NuxtImg
            densities="1x 2x"
            v-if="concertInfo.images && concertInfo.images.length"
            :src="concertInfo.images[0]?.url"
            :alt="concertInfo.name.en || 'Concert Image'"
            height="800"
            width="600"
            format="webp"
            class="object-cover"
          />
          <div
            v-else
            class="bg-charcoal flex items-center justify-center text-xl uppercase"
          >
            No Image
          </div>
          <div
            class="absolute top-0 right-0 bg-neon-red text-charcoal px-4 py-2 text-sm uppercase font-bold"
          >
            {{ concertInfo.sales_status ? "On Sale" : "Sold Out" }}
          </div>
        </div>

        <!-- Info Section -->
        <div class="w-1/2 space-y-6">
          <!-- Venue -->
          <div class="border-l-4 border-olive-green pl-4">
            <h2 class="text-xl uppercase font-bold">Venue</h2>
            <p class="text-2xl">
              {{ concertInfo.venue.name.en }}
            </p>
            <p class="text-2xl">
              {{ concertInfo.venue.address.en }}
            </p>
          </div>

          <!-- Date & Time -->
          <div class="border-l-4 border-neon-red pl-4">
            <h2 class="text-xl uppercase font-bold">When</h2>
            <p class="text-2xl">{{ concertInfo.show_time.text_full }}</p>
          </div>

          <!-- Price -->
          <div class="border-l-4 border-muted-white pl-4">
            <h2 class="text-xl uppercase font-bold">Price</h2>
            <p class="text-2xl text-red-500">
              {{ concertInfo.price.min_text }} - {{ concertInfo.price.max_text }}
            </p>
          </div>

          <!-- Call to Action -->
          <div>
            <button
              @click="fetchTickets"
              v-if="concertInfo.sales_status"
              class="block w-full text-3xl text-center bg-neon-red text-charcoal py-3 px-6 uppercase font-bold border-4 border-charcoal hover:bg-olive-green transition-colors"
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>

      <!-- Description -->
      <section class="mt-12 border-t-4 border-muted-white pt-6">
        <h2 class="text-2xl uppercase font-bold mb-4">About</h2>
        <p v-if="concertInfo.description?.en" v-html="concertInfo.description.en"></p>
        <p v-else>Loading description...</p>
      </section>

      <!-- Attributes (if any) -->
      <section
        v-if="concertInfo.attributes && concertInfo.attributes.length"
        class="mt-12 border-t-4 border-olive-green pt-6"
      >
        <h2 class="text-2xl uppercase font-bold mb-4">Details</h2>
        <ul class="space-y-2">
          <li v-for="attr in concertInfo.attributes" :key="attr.id">
            <strong>{{ attr.name.en }}:</strong>
            {{ attr.items.map((item) => item.name.en).join(", ") }}
          </li>
        </ul>
      </section>
    </div>

    <!-- Rounds Modal -->
    <TicketRoundsModal
      :is-open="isRoundsModalOpen"
      :rounds="rounds"
      @close="isRoundsModalOpen = false"
      @select-round="handleRoundSelection"
    />

    <!-- Variants Modal -->
    <TicketVariantModal
      :is-rounds="rounds ? true : false"
      :is-open="isVariantModalOpen"
      :concert-id="concertId"
      :variants="variants"
      @close="isVariantModalOpen = false"
      @select-variant="handleVariantSelection"
    />
  </div>
</template>

<style scoped lang="scss">
/* Brutalist shadow effect */
.shadow-brutalist {
  box-shadow: 8px 8px 0px #e5e5e5;
}

/* Texture overlay for Brutalist feel */
.container {
  position: relative;
  isolation: isolate;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAG0lEQVQYV2NkYGD4z8DAwMgABXAGNgGwAANGFgYGMAEDhgAAAABJRU5ErkJggg==")
    repeat;
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}

/* Ensure text doesn't break layout */
h1,
h2,
p {
  word-break: break-word;
}
</style>
