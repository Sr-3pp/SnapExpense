<script setup lang="ts">
import type { ExpenseRecord } from '~~/shared/types/expense';

const selectedExpense = ref<ExpenseRecord | null>(null);
const { open: openEditModal } = useModal('editExpense');
const { open: openDeleteModal } = useModal('deleteExpense');

const handleUpdate = () => {
  selectedExpense.value = null;
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
  <UApp>
    <NuxtRouteAnnouncer />
    <AppNavigation />
    
    <UMain class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
      <ExpenseList @edit="handleEdit" @delete="handleDelete" />
    </UMain>
    <ModalUploadTicket />

    <ModalExpenseEdit
      :expense="selectedExpense"
      @saved="handleUpdate"
    />
    <ModalExpenseDelete
      :expense="selectedExpense"
      @deleted="handleUpdate"
    />
  </UApp>
</template>
