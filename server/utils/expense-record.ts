import { ObjectId } from 'mongodb';

import type { ExpenseRecord } from '~~/shared/types/expense';
import type { TicketExtraction } from '~~/shared/types/ticket';

import type { ExpenseDocument } from '~~/server/types/expense';

const toIsoString = (value: Date | string) => {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
};

export const toExpenseRecord = (document: ExpenseDocument): ExpenseRecord => {
  return {
    id: document._id.toString(),
    merchant: document.merchant,
    purchaseDate: document.purchaseDate,
    currency: document.currency,
    total: document.total,
    subtotal: document.subtotal,
    tax: document.tax,
    tip: document.tip,
    invoiceNumber: document.invoiceNumber,
    paymentMethod: document.paymentMethod,
    items: document.items,
    notes: document.notes,
    createdAt: toIsoString(document.createdAt),
    updatedAt: toIsoString(document.updatedAt)
  };
};

export const toExpenseDocument = (
  expense: TicketExtraction,
  timestamps: { createdAt: Date; updatedAt: Date }
): Omit<ExpenseDocument, '_id'> => {
  return {
    ...expense,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt
  };
};

export const createExpenseTimestamps = () => {
  const now = new Date();

  return {
    createdAt: now,
    updatedAt: now
  };
};

export const toExpenseObjectId = (id: string) => {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid expense id.');

    Object.assign(error, {
      statusCode: 400,
      statusMessage: 'Invalid expense id.'
    });

    throw error;
  }

  return new ObjectId(id);
};
