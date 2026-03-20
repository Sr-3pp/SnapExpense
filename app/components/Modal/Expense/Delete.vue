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
    title="Delete Expense"
    description="This will permanently remove the expense from MongoDB."
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
          Delete
          <span class="font-medium text-(--ui-text-highlighted)">
            {{ expense?.merchant || 'this expense' }}
          </span>
          from the registered expenses list.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancel"
          @click="closeModal"
        />

        <UButton
          color="error"
          label="Delete"
          :loading="isDeletingExpense"
          @click="confirmDelete"
        />
      </div>
    </template>
  </UModal>
</template>
