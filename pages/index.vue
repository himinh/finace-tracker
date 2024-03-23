<script setup lang="ts">
import { transactionViewOptions } from '~/constants';
const supabase = useSupabaseClient();

export interface ITransaction {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  description: string;
  category: string;
}

const selectedView = ref(transactionViewOptions[1]);

const {
  data: transactions,
  pending: isLoading,
  error,
  refresh,
} = await useAsyncData('transactions', async () => {
  const { data, error } = await supabase.from('transactions').select('*');

  if (error) return [];

  return data as ITransaction[];
});

const transactionsGroupByDate = computed(() => {
  const grouped: Record<string, ITransaction[]> = {};
  for (const transaction of transactions.value!) {
    const date = new Date(transaction.created_at).toISOString().split('T')[0];

    if (!grouped[date]) grouped[date] = [];

    grouped[date].push(transaction);
  }

  return grouped;
});
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
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="4000"
      :last-amount="5000"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="2000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupByDate"
      :key="date"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<style lang="css" scoped></style>
