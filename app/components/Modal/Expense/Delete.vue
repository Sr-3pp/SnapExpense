<script setup lang="ts">
import type { ExpenseRecord } from '~~/shared/types/expense';

const props = defineProps<{
  expense: ExpenseRecord | null;
}>();

const emit = defineEmits<{
  closed: [];
  deleted: [];
}>();

const { isOpen, close } = useModal('deleteExpense');
const { removeExpense } = useExpenses();

const isDeletingExpense = ref(false);
const deleteError = ref('');

const closeModal = () => {
  close();
  emit('closed');
};

const confirmDelete = async () => {
  if (!props.expense) {
    return;
  }

  deleteError.value = '';
  isDeletingExpense.value = true;

  try {
    await removeExpense(props.expense.id);
    emit('deleted');
    close();
    emit('closed');
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : 'Failed to delete expense.';
  } finally {
    isDeletingExpense.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Eliminar gasto"
    description="Esta accion eliminara el gasto de forma permanente en MongoDB."
    @update:open="!$event && emit('closed')"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="deleteError"
          color="error"
          variant="soft"
          :title="deleteError"
        />

        <p class="text-sm text-(--ui-text-muted)">
          Eliminar
          <span class="font-medium text-(--ui-text-highlighted)">
            {{ expense?.merchant || 'este gasto' }}
          </span>
          de la lista de gastos registrados.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancelar"
          @click="closeModal"
        />

        <UButton
          color="error"
          label="Eliminar"
          :loading="isDeletingExpense"
          @click="confirmDelete"
        />
      </div>
    </template>
  </UModal>
</template>
