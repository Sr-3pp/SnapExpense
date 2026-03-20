<script setup lang="ts">
defineProps<{
  notes: string[];
}>();

const emit = defineEmits<{
  add: [];
  remove: [index: number];
}>();
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-sm font-semibold text-(--ui-text-highlighted)">
          Notas
        </h3>
        <p class="text-sm text-(--ui-text-muted)">
          Agrega cualquier detalle extra extraido del ticket.
        </p>
      </div>

      <UButton
        type="button"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Agregar nota"
        @click="emit('add')"
      />
    </div>

    <div
      v-if="notes.length"
      class="space-y-3"
    >
      <div
        v-for="(_, index) in notes"
        :key="`note-${index}`"
        class="flex items-start gap-2"
      >
        <UFormField :name="`notes.${index}`" class="flex-1">
          <UInput v-model="notes[index]" class="w-full" />
        </UFormField>

        <UButton
          type="button"
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          class="mt-6"
          @click="emit('remove', index)"
        />
      </div>
    </div>

    <UAlert
      v-else
      color="neutral"
      variant="soft"
      title="No hay notas asociadas a este ticket."
    />
  </div>
</template>
