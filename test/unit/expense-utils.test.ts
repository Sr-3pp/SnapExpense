import { describe, expect, it } from 'vitest';

import { normalizePaymentMethod } from '../../shared/constants/payment-methods';
import {
  cloneExpense,
  createEmptyExpense,
  createEmptyLineItem
} from '../../shared/utils/expense';

describe('expense helpers', () => {
  it('creates an empty expense shape with nullable defaults', () => {
    expect(createEmptyExpense()).toEqual({
      merchant: null,
      purchaseDate: null,
      currency: null,
      total: null,
      subtotal: null,
      tax: null,
      tip: null,
      invoiceNumber: null,
      paymentMethod: null,
      items: [],
      notes: []
    });
  });

  it('creates an empty line item shape', () => {
    expect(createEmptyLineItem()).toEqual({
      name: '',
      quantity: null,
      unitPrice: null,
      totalPrice: null
    });
  });

  it('clones nested arrays instead of reusing references', () => {
    const source = {
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 120,
      subtotal: 100,
      tax: 16,
      tip: 4,
      invoiceNumber: 'INV-1',
      paymentMethod: 'credit card' as const,
      items: [
        {
          name: 'Coffee',
          quantity: 1,
          unitPrice: 50,
          totalPrice: 50
        }
      ],
      notes: ['ocr uncertain']
    };

    const clone = cloneExpense(source);

    clone.items[0]!.name = 'Tea';
    clone.notes[0] = 'updated';

    expect(source.items[0]!.name).toBe('Coffee');
    expect(source.notes[0]).toBe('ocr uncertain');
  });

  it('falls back to an empty expense when cloning nullish values', () => {
    expect(cloneExpense(null)).toEqual(createEmptyExpense());
    expect(cloneExpense(undefined)).toEqual(createEmptyExpense());
  });
});

describe('payment method normalization', () => {
  it('normalizes aliases and accented values', () => {
    expect(normalizePaymentMethod('Tarjeta de crédito')).toBe('credit card');
    expect(normalizePaymentMethod('SPEI')).toBe('bank transfer');
    expect(normalizePaymentMethod('Mercado Pago')).toBe('digital wallet');
  });

  it('returns null for non-string or blank values', () => {
    expect(normalizePaymentMethod(undefined)).toBeNull();
    expect(normalizePaymentMethod('   ')).toBeNull();
  });

  it('maps unknown strings to other', () => {
    expect(normalizePaymentMethod('voucher')).toBe('other');
  });
});
