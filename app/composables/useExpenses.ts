import type { ExpenseRecord } from '~~/shared/types/expense';
import type { TicketExtraction } from '~~/shared/types/ticket';

export const useExpenses = () => {
  const expenses = useState<ExpenseRecord[]>('expenses', () => []);
  const isLoadingExpenses = useState('expenses-loading', () => false);

  const loadExpenses = async () => {
    isLoadingExpenses.value = true;

    try {
      expenses.value = await $fetch<ExpenseRecord[]>('/api/expenses');
    } finally {
      isLoadingExpenses.value = false;
    }
  };

  const removeExpense = async (id: string) => {
    await $fetch(`/api/expenses/${id}`, {
      method: 'DELETE'
    });

    expenses.value = expenses.value.filter((expense) => expense.id !== id);
  };

  const patchExpense = async (id: string, expense: TicketExtraction) => {
    const response = await $fetch<ExpenseRecord>(`/api/expenses/${id}`, {
      method: 'PATCH',
      body: expense
    });

    expenses.value = expenses.value.map((currentExpense) =>
      currentExpense.id === id ? response : currentExpense
    );

    return response;
  };

  const saveExpense = async (expense: TicketExtraction) => {
    const response = await $fetch<ExpenseRecord>('/api/expenses', {
      method: 'POST',
      body: expense
    });

    expenses.value = [response, ...expenses.value];

    return response;
  };

  return {
    expenses,
    isLoadingExpenses,
    loadExpenses,
    removeExpense,
    patchExpense,
    saveExpense
  };
};
