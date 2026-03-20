import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';

import UploadTicketModal from '../../app/components/Modal/UploadTicket.vue';

const { closeMock } = vi.hoisted(() => ({
  closeMock: vi.fn()
}));

mockNuxtImport('useModal', () => () => ({
  isOpen: ref(true),
  close: closeMock
}));

describe('ModalUploadTicket', () => {
  it('closes when the ticket wizard emits saved', async () => {
    const wrapper = await mountSuspended(UploadTicketModal, {
      global: {
        stubs: {
          UModal: {
            template: '<div><slot name="body" /></div>'
          },
          TicketWizard: {
            emits: ['saved'],
            template: '<button @click="$emit(\'saved\')">Save Ticket</button>'
          }
        }
      }
    });

    await wrapper.get('button').trigger('click');

    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
