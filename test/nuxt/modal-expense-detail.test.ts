import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import DetailExpenseModal from '../../app/components/Modal/Expense/Detail.vue';

const closeMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useModal', () => () => ({
  isOpen: ref(true),
  close: closeMock
}));

describe('ModalExpenseDetail', () => {
  it('renders expense details and closes from the footer action', async () => {
    const expense = {
      id: 'expense-1',
      merchant: 'Cafe Central',
      purchaseDate: '2026-03-19',
      currency: 'MXN',
      total: 133.4,
      subtotal: 115,
      tax: 18.4,
      tip: null,
      invoiceNumber: 'INV-123',
      paymentMethod: 'credit card' as const,
      items: [
        {
          name: 'Latte',
          quantity: 1,
          unitPrice: 45,
          totalPrice: 45
        }
      ],
      notes: ['OCR matched merchant confidently.'],
      createdAt: '2026-03-19T10:00:00.000Z',
      updatedAt: '2026-03-19T10:05:00.000Z'
    };

    const wrapper = await mountSuspended(DetailExpenseModal, {
      props: {
        expense
      },
      global: {
        stubs: {
          UModal: {
            emits: ['update:open'],
            template: '<div><slot name="body" /><slot name="footer" /></div>'
          },
          UButton: {
            props: ['label'],
            emits: ['click'],
            template: '<button @click="$emit(\'click\')">{{ label }}</button>'
          },
          UBadge: {
            template: '<span><slot /></span>'
          }
        }
      }
    });

    expect(wrapper.text()).toContain('Cafe Central');
    expect(wrapper.text()).toContain('Latte');
    expect(wrapper.text()).toContain('OCR matched merchant confidently.');

    await wrapper.get('button').trigger('click');

    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('closed')).toHaveLength(1);
  });
});
