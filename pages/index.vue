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
const isOpen = ref(false);

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

const income = computed(() =>
  transactions.value?.filter((t) => t.type === 'Income')
);
const expense = computed(() =>
  transactions.value?.filter((t) => t.type === 'Expense')
);
const incomeCount = computed(() => income.value?.length);
const expenseCount = computed(() => expense.value?.length);
const incomeTotal = computed(
  () => income.value?.reduce((a, b) => a + b.amount, 0) || 0
);
const expenseTotal = computed(
  () => income.value?.reduce((a, b) => a + b.amount, 0) || 0
);

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
      :amount="incomeTotal"
      :last-amount="3000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
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

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </div>
    </div>

    <div>
      <TransactionModal v-model="isOpen" />

      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
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
