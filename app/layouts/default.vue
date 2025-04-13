<script setup lang="ts"></script>
<template>
  <main class="min-h-screen bg-charcoal text-white font-mono">
    <NuxtLoadingIndicator />
    <BaseNavigation />
    <div class="container py-20">
      <slot />
    </div>
  </main>
</template>

<style scoped></style>
