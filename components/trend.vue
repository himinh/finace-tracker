<script setup lang="ts">
interface IProp {
  title: string;
  amount: number;
  lastAmount: number;
  color: string;
  loading: boolean;
}

defineProps<IProp>();
</script>

<template>
  <div>
    <!-- title -->
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <!-- amount -->
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>{{ amount }}</div>
    </div>

    <!-- icons -->
    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          name="i-heroicons-arrow-trending-up"
          class="w-6 h-6"
          :class="[color]"
        />

        <div class="text-gray-500 dark:text-gray-400">30% vs last period</div>
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
