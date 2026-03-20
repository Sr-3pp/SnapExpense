import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import EditExpenseModal from '../../app/components/Modal/Expense/Edit.vue';

const {
  closeMock,
  patchExpenseMock
} = vi.hoisted(() => ({
  closeMock: vi.fn(),
  patchExpenseMock: vi.fn().mockResolvedValue({})
}));

mockNuxtImport('useModal', () => () => ({
  isOpen: ref(true),
  close: closeMock
}));

mockNuxtImport('useExpenses', () => () => ({
  patchExpense: patchExpenseMock
}));

describe('ModalExpenseEdit', () => {
  it('patches and closes when the form submits', async () => {
    const expense = {
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

    const wrapper = await mountSuspended(EditExpenseModal, {
      props: {
        expense
      },
      global: {
        stubs: {
          UModal: {
            template: '<div><slot name="body" /></div>'
          },
          UAlert: {
            template: '<div />'
          },
          ExpenseForm: {
            props: ['expense'],
            emits: ['submit', 'cancel'],
            template: '<button @click="$emit(\'submit\', expense)">Submit Form</button>'
          }
        }
      }
    });

    await wrapper.get('button').trigger('click');

    expect(patchExpenseMock).toHaveBeenCalledWith('expense-1', expense);
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('saved')).toHaveLength(1);
  });
});
