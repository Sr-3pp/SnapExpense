import type { TicketExtraction, TicketLineItem } from '~~/types/ticket';

export const createEmptyLineItem = (): TicketLineItem => ({
  name: '',
  quantity: null,
  unitPrice: null,
  totalPrice: null
});

export const createEmptyExpense = (): TicketExtraction => ({
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

export const cloneExpense = (expense: TicketExtraction | null | undefined): TicketExtraction => {
  if (!expense) {
    return createEmptyExpense();
  }

  return {
    merchant: expense.merchant,
    purchaseDate: expense.purchaseDate,
    currency: expense.currency,
    total: expense.total,
    subtotal: expense.subtotal,
    tax: expense.tax,
    tip: expense.tip,
    invoiceNumber: expense.invoiceNumber,
    paymentMethod: expense.paymentMethod,
    items: expense.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    })),
    notes: [...expense.notes]
  };
};
