import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import DeleteExpenseModal from '../../app/components/Modal/Expense/Delete.vue';

const {
  closeMock,
  removeExpenseMock
} = vi.hoisted(() => ({
  closeMock: vi.fn(),
  removeExpenseMock: vi.fn().mockResolvedValue(undefined)
}));

mockNuxtImport('useModal', () => () => ({
  isOpen: ref(true),
  close: closeMock
}));

mockNuxtImport('useExpenses', () => () => ({
  removeExpense: removeExpenseMock
}));

describe('ModalExpenseDelete', () => {
  it('removes the expense and closes on confirmation', async () => {
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

    const wrapper = await mountSuspended(DeleteExpenseModal, {
      props: {
        expense
      },
      global: {
        stubs: {
          UModal: {
            emits: ['update:open'],
            template: '<div><slot name="body" /><slot name="footer" /></div>'
          },
          UAlert: {
            template: '<div />'
          },
          UButton: {
            props: ['label', 'loading'],
            emits: ['click'],
            template: '<button :data-loading="loading" @click="$emit(\'click\')">{{ label }}</button>'
          }
        }
      }
    });

    const buttons = wrapper.findAll('button');

    await buttons[1]!.trigger('click');

    expect(removeExpenseMock).toHaveBeenCalledWith('expense-1');
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('deleted')).toHaveLength(1);
  });
});
