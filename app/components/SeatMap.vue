<script setup lang="ts">
import type { Seat, AvailableSeatDataObj } from "~~/types/concertSeatTypes";
import { ref } from "vue";
import type { Meta } from "~~/types/concertVariantTypes";

const props = defineProps<{
  seatData: AvailableSeatDataObj;
  meta: Meta;
  seatMin: number | undefined;
  seatMax: number | undefined;
}>();

const emit = defineEmits<{
  (e: "select-seats", seats: Seat[]): void;
}>();

const selectedSeats = ref<Seat[]>([]);
const toastMessage = ref<string | null>("");
const showToast = ref<boolean>(false);

const toggleSeat = (seat: Seat) => {
  if (seat.status !== "available") return;

  const index = selectedSeats.value.findIndex((s) => s.id === seat.id);
  if (index >= 0) {
    toastMessage.value = null;
    selectedSeats.value.splice(index, 1);
    showToast.value = false;
  } else {
    if (props.seatMax !== undefined && selectedSeats.value.length >= props.seatMax) {
      toastMessage.value = "Max seats reached";
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
        toastMessage.value = null;
      }, 3000);
      return; // Reject new selection instead of removing first
    }
    selectedSeats.value.push(seat);
  }
};

const confirmSelection = () => {
  if (props.seatMin !== undefined && selectedSeats.value.length < props.seatMin) {
    return; // Don't emit if below minimum
  }
  emit("select-seats", selectedSeats.value);
};

const getSeatPosition = (meta: string) => {
  const [x, y] = meta.split(",").map(Number);
  return { x, y };
};

const getSeatImage = (seat: Seat) => {
  if (selectedSeats.value.some((s) => s.id === seat.id)) {
    return "https://www.theconcert.com/assets/images/seate-mark.png";
  }
  if (seat.status === "available") {
    return "https://www.theconcert.com/assets/images/seat-blue.png";
  }
  return "https://www.theconcert.com/assets/images/seat-gray2.png";
};
</script>

<template>
  <div class="relative map-grid">
    <div
      v-show="showToast && toastMessage"
      class="fixed top-0 left-0 bg-charcoal border-4 flex items-center justify-center h-[100px] w-full text-white text-lg uppercase px-6 py-3 z-50 animate-toast-in"
    >
      <p>{{ toastMessage }}</p>
    </div>

    <div class="h-full relative">
      <svg
        width="100%"
        height="100%"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="overflow: hidden; position: relative"
        viewBox="371.9805 -106 520 694.8801"
        preserveAspectRatio="xMidYMid meet"
        class="border-2 border-charcoal"
      >
        <defs></defs>
        <!-- Stage -->
        <g v-if="meta?.stage?.length">
          <rect
            v-for="stage in meta.stage"
            :key="stage.name"
            x="622"
            y="-86"
            :width="stage.width"
            :height="stage.height"
            rx="3"
            ry="3"
            :fill="stage.color"
            stroke="#ffffff"
            stroke-width="0"
          />
          <text
            v-for="stage in meta.stage"
            :key="stage.name + '-text'"
            x="697"
            y="-66"
            text-anchor="middle"
            font-family="Arial"
            font-size="8px"
            stroke="none"
            fill="#ffffff"
            font-weight="bold"
          >
            <tspan :dy="3">{{ stage.name }}</tspan>
          </text>
        </g>
        <!-- Seats -->
        <g v-for="seat in seatData.seatData" :key="seat.id">
          <image
            x="10"
            y="10"
            width="48"
            height="48"
            preserveAspectRatio="none"
            :xlink:href="getSeatImage(seat)"
            :transform="`matrix(1,0,0,1,${getSeatPosition(seat.meta).x},${
              getSeatPosition(seat.meta).y
            })`"
            :style="
              seat.status === 'available' ? 'cursor: pointer' : 'cursor: not-allowed'
            "
            @click="toggleSeat(seat)"
          />
          <text
            v-if="!selectedSeats.find((s:Seat) => s.id === seat.id)"
            :x="34"
            :y="32"
            text-anchor="middle"
            font-family="Arial"
            font-size="12px"
            stroke="none"
            fill="#000000"
            font-weight="bold"
            :style="
              seat.status === 'available' ? 'cursor: pointer' : 'cursor: not-allowed'
            "
            :transform="`matrix(1,0,0,1,${getSeatPosition(seat.meta).x},${
              getSeatPosition(seat.meta).y
            })`"
            @click="toggleSeat(seat)"
          >
            <tspan :dy="4">{{ seat.name }}</tspan>
          </text>
        </g>
      </svg>
    </div>
    <div class="flex gap-6 h-full">
      <button
        class="w-full bg-neon-red text-charcoal py-2 uppercase font-bold border-2 border-charcoal hover:bg-green-500 hover:border-green-500 transition-colors"
        :disabled="props.seatMin !== undefined && selectedSeats.length < props.seatMin"
        @click="confirmSelection"
      >
        Confirm Seats
      </button>
      <button
        class="w-full text-white py-2 uppercase font-bold border-4 border-neon-red hover:bg-neon-red hover:text-charcoal transition-colors"
        :disabled="selectedSeats.length === 0"
        @click="
          selectedSeats = [];
          toastMessage = null;
          showToast = false;
        "
      >
        Clear Selection
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
svg {
  background: #1a1a1a; /* Charcoal background */
}
.map-grid {
  display: grid;
  grid-template-rows: 80vh auto;
  gap: 1rem;
}
.bg-charcoal {
  background: #1a1a1a;
}
</style>
