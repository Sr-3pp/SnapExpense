<script setup lang="ts">
const { isOpen, close } = useModal('uploadTicket');
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Upload Ticket"
    description="upload the ticket picture to get the details"
    name="uploadTicket"
  >
    <template #body>
      <TicketWizard @saved="close()" />
    </template>
  </UModal>
</template>
