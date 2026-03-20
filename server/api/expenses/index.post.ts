import { saveExpense } from '~~/server/repositories/expenses';
import { readValidatedExpense } from '~~/server/utils/expense-request';

export default defineEventHandler(async (event) => {
  const validatedExpense = await readValidatedExpense(event);

  return saveExpense(validatedExpense);
});
