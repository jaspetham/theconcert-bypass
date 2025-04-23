<script setup lang="ts">
import { useUserProfile } from "~~/composables/useUserProfile";
import type { UserInterface } from "~~/types/userTypes";
const { data } = await useUserProfile();
const user: ComputedRef<UserInterface | null> = computed(
  () => data.value?.response ?? null
);
</script>

<template>
  <main>
    <div v-if="user" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Avatar & Identity -->
      <section class="border-2 border-white p-6 flex flex-col gap-4 h-full">
        <div class="flex items-center gap-6">
          <NuxtImg
            densities="1x 2x"
            v-if="user.avatar?.url"
            :src="user.avatar.url"
            alt="user Avatar"
            width="96px"
            height="96px"
            format="webp"
            class="object-cover border-2 border-white"
          />
          <div>
            <h1 class="text-3xl uppercase">{{ user.first_name }} {{ user.last_name }}</h1>
            <p class="text-gray-400 text-sm">@{{ user.username }}</p>
            <p class="text-gray-400 text-sm">ID - {{ user.id }}</p>
          </div>
        </div>

        <div class="mt-4 text-sm leading-loose">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p>
            <strong>Phone:</strong> {{ user.phone_country_code }}
            {{ user.phone }}
          </p>
          <p><strong>Gender:</strong> {{ user.gender }}</p>
          <p>
            <strong>Birthday:</strong>
            {{
              new Date(user.birthday).toLocaleString("en-US", {
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
        </div>
      </section>

      <!-- Account Details -->
      <section
        class="border-2 border-white p-6 grid grid-cols-2 gap-4 text-sm leading-loose"
      >
        <div><strong>Level:</strong> {{ user.level?.name ?? "N/A" }}</div>
        <div><strong>Exp:</strong> {{ user.exp }}</div>
        <div><strong>Profile Score:</strong> {{ user.profile_score }}</div>
        <div><strong>Activated:</strong> {{ user.activated ? "YES" : "NO" }}</div>
        <div><strong>Verified:</strong> {{ user.is_verify ? "YES" : "NO" }}</div>
        <div>
          <strong>Registered:</strong>
          {{
            new Date(user.created_at).toLocaleString("en-US", {
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
        </div>
        <div>
          <strong>Last Login:</strong>
          {{
            new Date(user.last_login_at).toLocaleString("en-US", {
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
        </div>
        <div><strong>Language:</strong> {{ user.lang.toUpperCase() }}</div>
        <div class="col-span-2"><strong>Referral:</strong> {{ user.referral }}</div>
      </section>
      <!-- Account Details -->
      <section
        class="border-2 border-white p-6 grid grid-cols-2 gap-4 text-sm leading-loose"
      >
        <div><strong>Wallet Id:</strong> {{ user.wallet.id ?? "N/A" }}</div>
        <div><strong>Wallet Amount:</strong> {{ user.wallet.amount }}</div>
      </section>
    </div>
    <div v-else>
      <h1 class="text-3xl">No user Data</h1>
    </div>
  </main>
</template>

<style scoped></style>
