import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import ExpenseList from '../../app/components/Expense/List.vue';

describe('ExpenseList', () => {
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

  it('emits refresh, edit, and delete actions', async () => {
    const wrapper = await mountSuspended(ExpenseList, {
      props: {
        expenses: [expense],
        loading: false
      },
      global: {
        stubs: {
          UCard: {
            template: '<div><slot name="header" /><slot /></div>'
          },
          UButton: {
            props: ['label', 'loading'],
            emits: ['click'],
            template: '<button :data-loading="loading" @click="$emit(\'click\')">{{ label }}</button>'
          },
          UTable: {
            props: ['data'],
            template: `
              <div>
                <div v-for="row in data" :key="row.id">
                  <slot name="actions-cell" :row="{ original: row }" />
                </div>
              </div>
            `
          }
        }
      }
    });

    const buttons = wrapper.findAll('button');

    await buttons[0]!.trigger('click');
    await buttons[1]!.trigger('click');
    await buttons[2]!.trigger('click');

    expect(wrapper.emitted('refresh')).toHaveLength(1);
    expect(wrapper.emitted('edit')).toEqual([[expense]]);
    expect(wrapper.emitted('delete')).toEqual([[expense]]);
  });
});
