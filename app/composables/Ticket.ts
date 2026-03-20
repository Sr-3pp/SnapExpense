import type { ExpenseRecord } from '~~/shared/types/expense';
import type { TicketExtraction } from '~~/shared/types/ticket';

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
