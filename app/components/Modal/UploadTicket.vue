<script setup lang="ts">
const { isOpen, close } = useModal('uploadTicket');
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Subir ticket"
    description="Sube la imagen del ticket para extraer sus datos"
    name="uploadTicket"
  >
    <template #body>
      <TicketWizard @saved="close()" />
    </template>
  </UModal>
</template>
