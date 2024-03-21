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

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
    <Trend
      color="red"
      title="Income"
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
    <Trend
      color="green"
      title="Income"
      :amount="4000"
      :last-amount="3000"
      :loading="true"
    />
    <Trend
      color="red"
      title="Income"
      :amount="4000"
      :last-amount="3000"
      :loading="false"
    />
  </section>
</template>

<style lang="css" scoped></style>
