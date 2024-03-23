<script setup lang="ts">
import { watch } from 'vue';

const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user) return navigateTo('/');
  },
  { immediate: true }
);
</script>

<template>
  <UCard>
    <template #header> Signing in...</template>

    Waiting a moment while we sign you in...
  </UCard>
</template>

<style scoped></style>
