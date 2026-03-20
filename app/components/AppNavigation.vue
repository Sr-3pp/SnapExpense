<script setup lang="ts">
const { open } = useModal('uploadTicket');

const openUploadModal = () => {
  open();
};
</script>

<template>
  <header class="border-b border-(--ui-border) bg-(--ui-bg-elevated)/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-(--ui-primary) font-semibold text-(--ui-text-inverted)">
          SE
        </span>

        <span class="flex flex-col">
          <span class="text-sm font-semibold text-(--ui-text-highlighted)">SnapExpense</span>
          <span class="text-xs text-(--ui-text-muted)">Espacio de trabajo para extraer tickets</span>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-3">
        <UColorModeSwitch label="Cambiar modo de color" />

        <UButton
          @click="openUploadModal"
          color="primary"
          variant="ghost"
          label="Subir ticket"
        />
      </div>
    </div>
  </header>
</template>
