<script setup lang="ts">
import { ref } from 'vue';
import { transactionViewOptions } from '~/constants';

const selectedView = ref(transactionViewOptions[1]);
</script>

<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>

    <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
  </section>
</template>

<style lang="css" scoped></style>
