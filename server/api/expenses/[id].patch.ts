import { updateExpense } from '~~/server/repositories/expenses';
import { readValidatedExpense, requireExpenseId } from '~~/server/utils/expense-request';

export default defineEventHandler(async (event) => {
  const id = requireExpenseId(event);
  const validatedExpense = await readValidatedExpense(event);
  const updatedExpense = await updateExpense(id, validatedExpense);

  if (!updatedExpense) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Expense not found.'
    });
  }

  return updatedExpense;
});
