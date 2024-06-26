import type { ITransaction } from '~/interfaces/Transaction';

export const useFetchTransactions = async (
  period: ComputedRef<{
    from: Date;
    to: Date;
  }>
) => {
  const supabase = useSupabaseClient();

  const {
    data: transactions,
    pending,
    refresh,
  } = await useAsyncData(
    `transactions-${period.value.to.toDateString()}`,
    async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', period.value.from.toISOString())
        .lte('created_at', period.value.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) return [];

      return data as ITransaction[];
    },
    {
      watch: [period],
    }
  );

  const income = computed(() =>
    transactions.value?.filter((t) => t.type === 'Income')
  );
  const expense = computed(() =>
    transactions.value?.filter((t) => t.type === 'Expense')
  );
  const savings = computed(() =>
    transactions.value?.filter((t) => t.type === 'Expense')
  );
  const investments = computed(() =>
    transactions.value?.filter((t) => t.type === 'Expense')
  );
  const incomeCount = computed(() => income.value?.length);
  const expenseCount = computed(() => expense.value?.length);
  const savingCount = computed(() => income.value?.length);
  const investmentCount = computed(() => expense.value?.length);
  const incomeTotal = computed(
    () => income.value?.reduce((a, b) => a + b.amount, 0) || 0
  );
  const expenseTotal = computed(
    () => income.value?.reduce((a, b) => a + b.amount, 0) || 0
  );
  const savingTotal = computed(
    () => savings.value?.reduce((a, b) => a + b.amount, 0) || 0
  );
  const investmentsTotal = computed(
    () => investments.value?.reduce((a, b) => a + b.amount, 0) || 0
  );

  const transactionsGroupByDate = computed(() => {
    const grouped: Record<string, ITransaction[]> = {};
    for (const transaction of transactions.value!) {
      const date = transaction.created_at.split('T')[0];

      if (!grouped[date]) grouped[date] = [];

      grouped[date].push(transaction);
    }

    // const sortedKeys = Object.keys(grouped).sort().reverse();
    // const sortedGrouped: Record<string, ITransaction[]> = {};

    // for (const key of sortedKeys) {
    //   sortedGrouped[key] = grouped[key];
    // }

    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupByDate,
      },
      income,
      expense,
      incomeCount,
      expenseCount,
      savingCount,
      investmentCount,
      incomeTotal,
      expenseTotal,
      savingTotal,
      investmentsTotal,
    },
    pending,
    refresh,
  };
};
