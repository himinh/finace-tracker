<script setup lang="ts">
import { computed } from 'vue';

interface IProp {
  title: string;
  amount: number;
  lastAmount: number;
  color: string;
  loading: boolean;
}

const props = defineProps<IProp>();

const trendingUp = computed(() => props.amount >= props.lastAmount);

const { currency } = useCurrency(props.amount);

const icon = computed(() =>
  trendingUp.value
    ? 'i-heroicons-arrow-trending-up'
    : 'i-heroicons-arrow-trending-down'
);

const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return '♾️%';

  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);

  const ratio = ((bigger - lower) / lower) * 100;

  return `${Math.ceil(ratio)}%`;
});
</script>

<template>
  <div>
    <!-- title -->
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <!-- amount -->
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>{{ currency }}</div>
    </div>

    <!-- icons -->
    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="[color]" />

        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
