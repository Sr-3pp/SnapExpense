import type { ExpenseRecord } from '~~/shared/types/expense';
import type { TicketExtraction } from '~~/shared/types/ticket';

import { getExpensesCollection } from '~~/server/utils/mongodb';
import {
  createExpenseTimestamps,
  toExpenseDocument,
  toExpenseObjectId,
  toExpenseRecord
} from '~~/server/utils/expense-record';

export async function listExpenses(): Promise<ExpenseRecord[]> {
  const collection = await getExpensesCollection();
  const documents = await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return documents.map((document) => toExpenseRecord(document));
}

export async function saveExpense(expense: TicketExtraction): Promise<ExpenseRecord> {
  const timestamps = createExpenseTimestamps();
  const collection = await getExpensesCollection();
  const expenseDocument = toExpenseDocument(expense, timestamps);

  const insertResult = await collection.insertOne(expenseDocument);

  return toExpenseRecord({
    _id: insertResult.insertedId,
    ...expenseDocument
  });
}

export async function deleteExpense(id: string): Promise<boolean> {
  const collection = await getExpensesCollection();
  const expenseId = toExpenseObjectId(id);
  const result = await collection.deleteOne({
    _id: expenseId
  });

  return result.deletedCount === 1;
}

export async function updateExpense(id: string, expense: TicketExtraction): Promise<ExpenseRecord | null> {
  const collection = await getExpensesCollection();
  const expenseId = toExpenseObjectId(id);
  const updatedAt = new Date();

  const result = await collection.findOneAndUpdate(
    { _id: expenseId },
    {
      $set: {
        ...expense,
        updatedAt
      }
    },
    {
      returnDocument: 'after'
    }
  );

  if (!result) {
    return null;
  }

  return toExpenseRecord(result);
}
