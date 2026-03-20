import { deleteExpense } from '~~/server/repositories/expenses';
import { requireExpenseId } from '~~/server/utils/expense-request';

export default defineEventHandler(async (event) => {
  const id = requireExpenseId(event);
  const deleted = await deleteExpense(id);

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Expense not found.'
    });
  }

  return {
    success: true
  };
});
