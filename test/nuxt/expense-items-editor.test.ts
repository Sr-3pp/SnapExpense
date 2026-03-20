import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import ExpenseItemsEditor from '../../app/components/Expense/ItemsEditor.vue';

describe('ExpenseItemsEditor', () => {
  it('emits add and remove actions', async () => {
    const wrapper = await mountSuspended(ExpenseItemsEditor, {
      props: {
        items: [
          {
            name: 'Coffee',
            quantity: 1,
            unitPrice: 50,
            totalPrice: 50
          }
        ]
      },
      global: {
        stubs: {
          UButton: {
            props: ['label'],
            emits: ['click'],
            template: '<button @click="$emit(\'click\')">{{ label }}</button>'
          },
          UFormField: {
            template: '<div><slot /></div>'
          },
          UInput: {
            template: '<input />'
          },
          UInputNumber: {
            template: '<input />'
          },
          UAlert: {
            template: '<div />'
          }
        }
      }
    });

    const buttons = wrapper.findAll('button');

    await buttons[0]!.trigger('click');
    await buttons[1]!.trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1);
    expect(wrapper.emitted('remove')).toEqual([[0]]);
  });
});
