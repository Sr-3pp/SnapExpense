import { ObjectId } from 'mongodb';
import { describe, expect, it } from 'vitest';

import {
  createExpenseTimestamps,
  toExpenseDocument,
  toExpenseObjectId,
  toExpenseRecord
} from '../../server/utils/expense-record';

describe('expense record mapping', () => {
  it('maps a persisted document into an API record', () => {
    const document = {
      _id: new ObjectId('507f1f77bcf86cd799439011'),
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 116,
      subtotal: 100,
      tax: 16,
      tip: null,
      invoiceNumber: 'INV-1',
      paymentMethod: 'debit card' as const,
      items: [],
      notes: [],
      createdAt: new Date('2026-03-19T10:00:00.000Z'),
      updatedAt: new Date('2026-03-19T11:00:00.000Z')
    };

    expect(toExpenseRecord(document)).toEqual({
      id: '507f1f77bcf86cd799439011',
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 116,
      subtotal: 100,
      tax: 16,
      tip: null,
      invoiceNumber: 'INV-1',
      paymentMethod: 'debit card',
      items: [],
      notes: [],
      createdAt: '2026-03-19T10:00:00.000Z',
      updatedAt: '2026-03-19T11:00:00.000Z'
    });
  });

  it('builds a persisted document payload from an expense input', () => {
    const createdAt = new Date('2026-03-19T10:00:00.000Z');
    const updatedAt = new Date('2026-03-19T11:00:00.000Z');
    const expense = {
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 116,
      subtotal: 100,
      tax: 16,
      tip: null,
      invoiceNumber: 'INV-1',
      paymentMethod: 'debit card' as const,
      items: [],
      notes: []
    };

    expect(toExpenseDocument(expense, { createdAt, updatedAt })).toEqual({
      ...expense,
      createdAt,
      updatedAt
    });
  });

  it('creates matching created and updated timestamps', () => {
    const timestamps = createExpenseTimestamps();

    expect(timestamps.createdAt).toBeInstanceOf(Date);
    expect(timestamps.updatedAt).toBeInstanceOf(Date);
    expect(timestamps.createdAt.getTime()).toBe(timestamps.updatedAt.getTime());
  });

  it('parses valid object ids and rejects invalid ones', () => {
    expect(toExpenseObjectId('507f1f77bcf86cd799439011')).toBeInstanceOf(ObjectId);
    expect(() => toExpenseObjectId('invalid-id')).toThrow('Invalid expense id.');
  });
});
