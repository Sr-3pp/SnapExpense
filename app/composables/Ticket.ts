import type { ExpenseRecord } from '~~/types/expense';
import type { TicketExtraction } from '~~/types/ticket';

export const useTicket = () => {
  const {
    expenses,
    isLoadingExpenses,
    loadExpenses,
    removeExpense,
    patchExpense,
    saveExpense
  } = useExpenses();
  const { extractData } = useTicketExtraction();

  return {
    expenses,
    isLoadingExpenses,
    loadExpenses,
    extractData,
    removeExpense,
    patchExpense,
    saveExpense
  };
};
