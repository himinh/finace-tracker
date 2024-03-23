import type { ITransaction } from '~/interfaces/Transaction';

export const useFetchTransactions = async () => {
  const supabase = useSupabaseClient();

  const {
    data: transactions,
    pending,
    refresh,
  } = await useAsyncData('transactions', async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

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
      incomeTotal,
      expenseTotal,
    },
    pending,
    refresh,
  };
};
