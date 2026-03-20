<script setup lang="ts">
import type { TicketExtraction } from '~~/shared/types/ticket';
import { ticketExtractionSchema } from '~~/shared/schemas/ticket';
import {
  cloneExpense,
  createEmptyExpense,
  createEmptyLineItem
} from '~~/shared/utils/expense';

const props = withDefaults(defineProps<{
  expense?: TicketExtraction | null;
  loading?: boolean;
  submitLabel?: string;
}>(), {
  expense: null,
  loading: false,
  submitLabel: 'Guardar cambios'
});

const emit = defineEmits<{
  submit: [expense: TicketExtraction];
  cancel: [];
}>();

const state = reactive<TicketExtraction>(createEmptyExpense());

watch(
  () => props.expense,
  (expense) => {
    Object.assign(state, cloneExpense(expense));
  },
  { immediate: true }
);

const addItem = () => {
  state.items.push(createEmptyLineItem());
};

const removeItem = (index: number) => {
  state.items.splice(index, 1);
};

const addNote = () => {
  state.notes.push('');
};

const removeNote = (index: number) => {
  state.notes.splice(index, 1);
};

const emitCancel = () => {
  emit('cancel');
};

const handleSubmit = (event: { data: TicketExtraction }) => {
  emit('submit', event.data);
};
</script>

<template>
  <UForm
    :schema="ticketExtractionSchema"
    :state="state"
    class="space-y-6"
    @submit="handleSubmit"
  >
    <ExpenseFields :state="state" />

    <ExpenseItemsEditor
      :items="state.items"
      @add="addItem"
      @remove="removeItem"
    />

    <ExpenseNotesEditor
      :notes="state.notes"
      @add="addNote"
      @remove="removeNote"
    />

    <div class="flex justify-end gap-3">
      <UButton
        type="button"
        color="neutral"
        variant="ghost"
        label="Cancelar"
        @click="emitCancel"
      />

      <UButton
        type="submit"
        color="primary"
        :label="submitLabel"
        :loading="loading"
      />
    </div>
  </UForm>
</template>
