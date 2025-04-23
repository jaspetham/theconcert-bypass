<script setup lang="ts">
import type { Seat, AvailableSeatDataObj } from "~~/types/concertSeatTypes";
import { ref, computed, onMounted, onUnmounted } from "vue";
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
const toastMessage = ref<string | null>(null);
const showToast = ref(false);
const zoom = ref(1);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const dragStart = ref<{ x: number; y: number } | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

const toggleSeat = (seat: Seat) => {
  if (seat.status !== "available") return;

  const index = selectedSeats.value.findIndex((s) => s.id === seat.id);
  if (index >= 0) {
    selectedSeats.value.splice(index, 1);
    toastMessage.value = null;
    showToast.value = false;
  } else {
    if (props.seatMax !== undefined && selectedSeats.value.length >= props.seatMax) {
      toastMessage.value = "Max seats reached";
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
        toastMessage.value = null;
      }, 3000); // Hide toast after 3 seconds
    } else {
      selectedSeats.value.push(seat);
    }
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

const getViewBox = computed(() => {
  const seatCoords = props.seatData.seatData.flatMap((seat) =>
    seat.meta.split(",").map(Number)
  );
  const allX = [278, ...seatCoords.filter((_, i) => i % 2 === 0)]; // Include stage x
  const allY = [-147, ...seatCoords.filter((_, i) => i % 2 === 1)]; // Include stage y
  const minX = Math.min(...allX) - 30;
  const minY = Math.min(...allY) - 30;
  const maxX = Math.max(...allX) + 30;
  const maxY = Math.max(...allY) + 78; // Account for seat height
  const width = (maxX - minX) / zoom.value;
  const height = (maxY - minY) / zoom.value;
  const centerX = (maxX + minX) / 2 + panX.value;
  const centerY = (maxY + minY) / 2 + panY.value;
  return `${centerX - width / 2} ${centerY - height / 2} ${width} ${height}`;
});

// Zoom and Pan Handlers
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  const zoomSpeed = 0.001;
  const oldZoom = zoom.value;
  zoom.value = Math.max(0.5, Math.min(5, zoom.value * (1 - event.deltaY * zoomSpeed)));
  // Adjust pan to zoom around mouse point
  if (svgRef.value) {
    const rect = svgRef.value.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / rect.width;
    const mouseY = (event.clientY - rect.top) / rect.height;
    const viewBox = getViewBox.value.split(" ").map(Number);
    const viewWidth = viewBox[2] ?? 0;
    const viewHeight = viewBox[3] ?? 0;
    panX.value += (mouseX - 0.5) * viewWidth * (1 / oldZoom - 1 / zoom.value);
    panY.value += (mouseY - 0.5) * viewHeight * (1 / oldZoom - 1 / zoom.value);
  }
};

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true;
  dragStart.value = { x: event.clientX, y: event.clientY };
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !dragStart.value || !svgRef.value) return;
  const rect = svgRef.value.getBoundingClientRect();
  const dx = (event.clientX - dragStart.value.x) / rect.width;
  const dy = (event.clientY - dragStart.value.y) / rect.height;
  const viewBox = getViewBox.value.split(" ").map(Number);
  panX.value -= (dx * (viewBox[2] ?? 0)) / zoom.value;
  panY.value -= (dy * (viewBox[3] ?? 0)) / zoom.value;
  dragStart.value = { x: event.clientX, y: event.clientY };
};

const handleMouseUp = () => {
  isDragging.value = false;
  dragStart.value = null;
};

const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length === 1) {
    isDragging.value = true;
    dragStart.value = { x: event.touches[0]!!.clientX, y: event.touches[0]!!.clientY };
  } else if (event.touches.length === 2) {
    event.preventDefault();
    const touch1 = event.touches[0]!!;
    const touch2 = event.touches[1]!!;
    const distance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
    dragStart.value = { x: distance, y: 0 };
  }
};

const handleTouchMove = (event: TouchEvent) => {
  if (!svgRef.value) return;
  if (event.touches.length === 1 && isDragging.value && dragStart.value) {
    const rect = svgRef.value.getBoundingClientRect();
    const dx = (event.touches[0]!!.clientX - dragStart.value.x) / rect.width;
    const dy = (event.touches[0]!!.clientY - dragStart.value.y) / rect.height;
    const viewBox = getViewBox.value.split(" ").map(Number);
    panX.value -= (dx * (viewBox[2] ?? 0)) / zoom.value;
    panY.value -= (dy * (viewBox[3] ?? 0)) / zoom.value;
    dragStart.value = {
      x: event.touches[0]?.clientX ?? 0,
      y: event.touches[0]?.clientY ?? 0,
    };
  } else if (event.touches.length === 2) {
    event.preventDefault();
    const touch1 = event.touches[0]!!;
    const touch2 = event.touches[1]!!;
    const newDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
    if (dragStart.value) {
      const oldZoom = zoom.value;
      zoom.value = Math.max(
        0.5,
        Math.min(5, zoom.value * (newDistance / dragStart.value.x))
      );
      const rect = svgRef.value.getBoundingClientRect();
      const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
      const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
      const mouseX = midX / rect.width;
      const mouseY = midY / rect.height;
      const viewBox = getViewBox.value.split(" ").map(Number);
      const viewWidth = viewBox[2] ?? 0;
      const viewHeight = viewBox[3] ?? 0;
      panX.value += (mouseX - 0.5) * viewWidth * (1 / oldZoom - 1 / zoom.value);
      panY.value += (mouseY - 0.5) * viewHeight * (1 / oldZoom - 1 / zoom.value);
      dragStart.value = { x: newDistance, y: 0 };
    }
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
  dragStart.value = null;
};

// Add event listeners
onMounted(() => {
  if (svgRef.value) {
    svgRef.value.addEventListener("wheel", handleWheel, { passive: false });
    svgRef.value.addEventListener("mousedown", handleMouseDown);
    svgRef.value.addEventListener("mousemove", handleMouseMove);
    svgRef.value.addEventListener("mouseup", handleMouseUp);
    svgRef.value.addEventListener("mouseleave", handleMouseUp);
    svgRef.value.addEventListener("touchstart", handleTouchStart, { passive: false });
    svgRef.value.addEventListener("touchmove", handleTouchMove, { passive: false });
    svgRef.value.addEventListener("touchend", handleTouchEnd);
  }
});

onUnmounted(() => {
  if (svgRef.value) {
    svgRef.value.removeEventListener("wheel", handleWheel);
    svgRef.value.removeEventListener("mousedown", handleMouseDown);
    svgRef.value.removeEventListener("mousemove", handleMouseMove);
    svgRef.value.removeEventListener("mouseup", handleMouseUp);
    svgRef.value.removeEventListener("mouseleave", handleMouseUp);
    svgRef.value.removeEventListener("touchstart", handleTouchStart);
    svgRef.value.removeEventListener("touchmove", handleTouchMove);
    svgRef.value.removeEventListener("touchend", handleTouchEnd);
  }
});
</script>

<template>
  <div class="relative map-grid">
    <!-- Toast Message -->
    <div
      v-if="showToast && toastMessage"
      class="fixed top-0 left-1/2 w-full flex items-center justify-center h-[100px] transform -translate-x-1/2 bg-charcoal text-white text-lg uppercase border-4 px-6 py-3 z-50 animate-toast-in"
    >
      {{ toastMessage }}
    </div>

    <svg
      ref="svgRef"
      width="100%"
      height="100%"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="overflow: hidden; position: relative"
      :viewBox="getViewBox"
      preserveAspectRatio="xMidYMid meet"
      class="border-4 border-charcoal"
    >
      <defs></defs>

      <!-- Stage -->
      <g v-if="meta?.stage?.length">
        <rect
          v-for="stage in meta.stage"
          :key="stage.name"
          :x="stage.x"
          :y="stage.y"
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
          :x="stage.x + stage.width / 2"
          :y="stage.y + stage.height / 2"
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
          :style="seat.status === 'available' ? 'cursor: pointer' : 'cursor: not-allowed'"
          @click="toggleSeat(seat)"
        />
        <text
          v-if="!selectedSeats.find((s) => s.id === seat.id)"
          :x="34"
          :y="32"
          text-anchor="middle"
          font-family="Arial"
          font-size="10px"
          stroke="none"
          fill="#000000"
          font-weight="bold"
          :style="seat.status === 'available' ? 'cursor: pointer' : 'cursor: not-allowed'"
          :transform="`matrix(1,0,0,1,${getSeatPosition(seat.meta).x},${
            getSeatPosition(seat.meta).y
          })`"
          @click="toggleSeat(seat)"
        >
          <tspan :dy="4">{{ seat.name }}</tspan>
        </text>
      </g>
    </svg>
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
  touch-action: none; /* Prevent default touch behaviors */
  user-select: none;
}

.map-grid {
  display: grid;
  grid-template-rows: 80vh auto;
  gap: 1rem;
}
.bg-charcoal {
  background: #1a1a1a;
}

.animate-toast-in {
  animation: toastIn 0.3s ease-in-out;
}

@keyframes toastIn {
  0% {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}
</style>
