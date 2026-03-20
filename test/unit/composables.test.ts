import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useExpenses } from '../../app/composables/useExpenses';
import { useTicketExtraction } from '../../app/composables/useTicketExtraction';

describe('useExpenses', () => {
  const stateStore = new Map<string, { value: unknown }>();
  const fetchMock = vi.fn();

  beforeEach(() => {
    stateStore.clear();
    fetchMock.mockReset();

    vi.stubGlobal('useState', (key: string, init: () => unknown) => {
      if (!stateStore.has(key)) {
        stateStore.set(key, { value: init() });
      }

      return stateStore.get(key)!;
    });

    vi.stubGlobal('$fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads expenses and clears the loading flag', async () => {
    const expensesResponse = [
      {
        id: 'expense-1',
        merchant: 'Store',
        purchaseDate: '2026-03-19',
        currency: 'MXN',
        total: 120,
        subtotal: 100,
        tax: 20,
        tip: null,
        invoiceNumber: 'INV-1',
        paymentMethod: 'cash' as const,
        items: [],
        notes: [],
        createdAt: '2026-03-19T10:00:00.000Z',
        updatedAt: '2026-03-19T10:00:00.000Z'
      }
    ];
    fetchMock.mockResolvedValueOnce(expensesResponse);

    const { expenses, isLoadingExpenses, loadExpenses } = useExpenses();

    await loadExpenses();

    expect(fetchMock).toHaveBeenCalledWith('/api/expenses');
    expect(expenses.value).toEqual(expensesResponse);
    expect(isLoadingExpenses.value).toBe(false);
  });

  it('saves, patches, and removes expenses from local state', async () => {
    const initialExpense = {
      id: 'expense-1',
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 120,
      subtotal: 100,
      tax: 20,
      tip: null,
      invoiceNumber: 'INV-1',
      paymentMethod: 'cash' as const,
      items: [],
      notes: [],
      createdAt: '2026-03-19T10:00:00.000Z',
      updatedAt: '2026-03-19T10:00:00.000Z'
    };
    const savedExpense = {
      ...initialExpense,
      id: 'expense-2'
    };
    const patchedExpense = {
      ...initialExpense,
      merchant: 'Updated Store'
    };
    const expensePayload = {
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 120,
      subtotal: 100,
      tax: 20,
      tip: null,
      invoiceNumber: 'INV-1',
      paymentMethod: 'cash' as const,
      items: [],
      notes: []
    };

    const { expenses, saveExpense, patchExpense, removeExpense } = useExpenses();
    expenses.value = [initialExpense];

    fetchMock.mockResolvedValueOnce(savedExpense);
    await saveExpense(expensePayload);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/expenses', {
      method: 'POST',
      body: expensePayload
    });
    expect(expenses.value).toEqual([savedExpense, initialExpense]);

    fetchMock.mockResolvedValueOnce(patchedExpense);
    await patchExpense('expense-1', expensePayload);

    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/expenses/expense-1', {
      method: 'PATCH',
      body: expensePayload
    });
    expect(expenses.value).toEqual([savedExpense, patchedExpense]);

    fetchMock.mockResolvedValueOnce(undefined);
    await removeExpense('expense-2');

    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/expenses/expense-2', {
      method: 'DELETE'
    });
    expect(expenses.value).toEqual([patchedExpense]);
  });
});

describe('useTicketExtraction', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('$fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uploads the selected ticket file as multipart form data', async () => {
    const extractionResponse = {
      merchant: 'Store',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 120,
      subtotal: 100,
      tax: 20,
      tip: null,
      invoiceNumber: 'INV-1',
      paymentMethod: 'cash' as const,
      items: [],
      notes: []
    };
    fetchMock.mockResolvedValueOnce(extractionResponse);

    const file = new File(['receipt'], 'ticket.png', { type: 'image/png' });
    const { extractData } = useTicketExtraction();
    const response = await extractData(file);

    expect(response).toEqual(extractionResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/extract');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('ticket')).toBe(file);
  });
});
