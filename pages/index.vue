<script setup lang="ts">
import { transactionViewOptions } from '~/constants';
const selectedView = ref(transactionViewOptions[1]);
const { current, previous } = useSelectedTimePeriod(selectedView);
const isOpen = ref(false);

const {
  pending,
  refresh,
  transactions: {
    grouped: { byDate: transactionsGroupByDate },
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
  },
} = await useFetchTransactions(current);

const {
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
  },
} = await useFetchTransactions(previous);
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
      :last-amount="prevIncomeTotal"
      :loading="pending"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      :loading="pending"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="2000"
      :loading="pending"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="3000"
      :loading="pending"
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
        @saved="refresh()"
      />
    </div>
  </section>

  <section v-if="!pending">
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
