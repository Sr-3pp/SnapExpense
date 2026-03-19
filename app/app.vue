<script setup lang="ts">
const { isOpen } = useModal('uploadTicket');
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
      <AppNavigation />

    <UModal
      v-model:open="isOpen"
      title="Upload Ticket"
      description="upload the ticket picture to get the details"
      name="uploadTicket"
    >
      <template #body>
        <TicketWizard />
      </template>
    </UModal>
  </UApp>
</template>
