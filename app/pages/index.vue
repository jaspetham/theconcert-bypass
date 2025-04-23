<script setup lang="ts">
import { useHighlightConcerts } from "~~/composables/useHighlightConcerts";
import type { ConcertInterface } from "~~/types/highlightConcertsTypes";

const { data, error, pending } = await useHighlightConcerts();
const concerts: ComputedRef<ConcertInterface[]> = computed(
  () => data.value?.data.record ?? []
);
</script>

<template>
  <main>
    <div v-if="pending" class="text-gray-500 text-lg">Loading...</div>
    <div v-if="error" class="text-red-500 text-lg">{{ error.message }}</div>
    <div
      v-if="concerts.length > 0"
      class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="concert in concerts"
        :key="concert.id"
        class="bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition-transform flex flex-col h-full"
      >
        <!-- Image -->
        <div class="w-full h-[300px]">
          <NuxtImg
            densities="1x 2x"
            :key="concert.images[0]?.id"
            width="375"
            height="300"
            :src="
              concert.images[0]?.mime === 'image/jpeg' ||
              concert.images[0]?.mime === 'image/png'
                ? `https://res.theconcert.com/w_375,h_300,c_thumb/${concert.images[0]?.id}/${concert.images[0]?.name}`
                : ''
            "
            :alt="concert.name"
            format="webp"
            class="w-full rounded-t-xl h-full object-cover"
          />
        </div>

        <div class="p-4 flex flex-col justify-between h-full">
          <!-- Title and Venue -->
          <div>
            <h2 class="text-xl font-bold text-gray-100 truncate">
              {{ concert.name }}
            </h2>
            <p class="text-sm text-gray-400 mt-2">{{ concert.venue.name }}</p>
            <p class="text-gray-400 mt-2">{{ concert.show_time.text_short }}</p>
            <p v-if="concert.soldout_status" class="text-red-500 font-semibold mt-2">
              Sold Out
            </p>
            <p
              :class="`${
                concert.sales_status ? 'text-green-500' : 'text-yellow-500'
              } font-semibold mt-2`"
            >
              {{ concert.sales_status ? "LIVE" : "Coming Soon" }}
            </p>
          </div>

          <!-- Time -->
          <p>
            <strong>Start:</strong>
            {{
              new Date(concert.show_time.start).toLocaleString("en-US", {
                timeZone: "Asia/Bangkok",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            }}
          </p>
          <p>
            <strong>End:</strong>
            {{
              new Date(concert.show_time.end).toLocaleString("en-US", {
                timeZone: "Asia/Bangkok",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })
            }}
          </p>

          <!-- View Details -->
          <div class="mt-6">
            <NuxtLink
              :to="'/concerts/' + concert.id"
              class="inline-block text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 py-2 px-6 rounded-full text-center font-semibold transition-transform transform hover:scale-105"
            >
              Buy Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="concerts && concerts.length === 0" class="text-gray-500 text-lg">
      No concerts available.
    </div>
  </main>
</template>
