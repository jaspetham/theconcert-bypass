<script setup lang="ts">
import type { Round } from "~~/types/concertRoundsTypes";

// Props
const props = defineProps<{
  rounds: Round[];
  isOpen: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "select-round", roundId: number): void;
}>();
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
        Select Round
      </h2>

      <!-- Rounds List with Scroll -->
      <div class="max-h-[60vh] pr-4 overflow-y-auto space-y-4">
        <div
          v-for="round in rounds"
          :key="round.id"
          class="border-4 border-muted-white p-4"
          :class="{ 'opacity-50': round.soldout_status }"
        >
          <!-- Round Info -->
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl uppercase font-bold">
                {{ round.name.en || "Round" }}
              </h3>
              <p class="text-lg">{{ round.show_time.text_full }}</p>
              <p
                class="text-sm"
                :class="round.remain > 0 ? 'text-olive-green' : 'text-neon-red'"
              >
                {{ round.remain > 0 ? `${round.remain} tickets left` : "Sold Out" }}
              </p>
            </div>
          </div>

          <!-- Action Button -->
          <button
            v-if="!round.soldout_status && round.remain > 0"
            class="mt-4 w-full bg-neon-red text-charcoal py-2 uppercase font-bold border-4 border-charcoal hover:bg-olive-green transition-colors"
            @click="emit('select-round', round.id)"
          >
            Get Tickets
          </button>
          <div
            v-else
            class="mt-4 w-full bg-charcoal text-muted-white py-2 uppercase font-bold border-4 border-neon-red text-center opacity-50"
          >
            Sold Out
          </div>
        </div>

        <!-- No Rounds -->
        <div
          v-if="!rounds.length"
          class="text-lg uppercase border-4 border-neon-red p-4 text-center"
        >
          No Rounds Available
        </div>
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
