<script setup lang="ts">
import type { ExpenseRecord } from '~~/shared/types/expense';

const selectedExpense = ref<ExpenseRecord | null>(null);
const { expenses, isLoadingExpenses, loadExpenses } = useExpenses();
const { open: openEditModal } = useModal('editExpense');
const { open: openDeleteModal } = useModal('deleteExpense');

const { refresh } = await useAsyncData('expenses', async () => {
  await loadExpenses();

  return expenses.value;
});

const clearSelectedExpense = () => {
  selectedExpense.value = null;
};

const handleRefresh = async () => {
  await refresh();
};

const handleEdit = (expense: ExpenseRecord) => {
  selectedExpense.value = expense;
  openEditModal();
};

const handleDelete = (expense: ExpenseRecord) => {
  selectedExpense.value = expense;
  openDeleteModal();
};
</script>

<template>
  <UMain class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
    <ExpenseList
      :expenses="expenses"
      :loading="isLoadingExpenses"
      @refresh="handleRefresh"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </UMain>

  <ModalExpenseEdit
    :expense="selectedExpense"
    @saved="clearSelectedExpense"
  />
  <ModalExpenseDelete
    :expense="selectedExpense"
    @deleted="clearSelectedExpense"
  />
</template>
