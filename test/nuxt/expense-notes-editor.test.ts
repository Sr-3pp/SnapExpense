import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import ExpenseNotesEditor from '../../app/components/Expense/NotesEditor.vue';

describe('ExpenseNotesEditor', () => {
  it('emits add and remove actions', async () => {
    const wrapper = await mountSuspended(ExpenseNotesEditor, {
      props: {
        notes: ['ocr uncertain']
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
