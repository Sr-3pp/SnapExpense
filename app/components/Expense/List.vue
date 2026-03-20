<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { PropType } from 'vue';

import type { ExpenseRecord } from '~~/shared/types/expense';

defineProps({
  expenses: {
    type: Array as PropType<ExpenseRecord[]>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  refresh: [];
  view: [expense: ExpenseRecord];
  edit: [expense: ExpenseRecord];
  delete: [expense: ExpenseRecord];
}>();

const columns: TableColumn<ExpenseRecord>[] = [
  {
    accessorKey: 'merchant',
    header: 'Comercio'
  },
  {
    accessorKey: 'purchaseDate',
    header: 'Fecha'
  },
  {
    accessorKey: 'currency',
    header: 'Moneda'
  },
  {
    accessorKey: 'total',
    header: 'Total'
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Pago'
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado'
  },
  {
    id: 'actions',
    header: 'Acciones'
  }
];

const openEdit = (expense: ExpenseRecord) => {
  emit('edit', expense);
};

const openView = (expense: ExpenseRecord) => {
  emit('view', expense);
};

const openDelete = (expense: ExpenseRecord) => {
  emit('delete', expense);
};

const createdAtFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'medium',
  timeZone: 'UTC'
});

const formatCreatedAt = (value: string) => {
  return createdAtFormatter.format(new Date(value));
};

const getExpenseActions = (expense: ExpenseRecord) => ([
  [
    {
      label: 'Editar',
      icon: 'i-lucide-pencil-line',
      onSelect: () => openEdit(expense)
    },
    {
      label: 'Eliminar',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      onSelect: () => openDelete(expense)
    }
  ]
]);
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-semibold text-(--ui-text-highlighted)">
            Gastos registrados
          </h1>
          <p class="text-sm text-(--ui-text-muted)">
            Tickets procesados almacenados en MongoDB.
          </p>
        </div>

        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="emit('refresh')"
        />
      </div>
    </template>

    <UTable
      :data="expenses"
      :columns="columns"
      :loading="loading"
      empty="Todavia no hay gastos registrados."
    >
      <template #total-cell="{ row }">
        {{ row.original.total ?? '-' }}
      </template>

      <template #createdAt-cell="{ row }">
        {{ formatCreatedAt(row.original.createdAt) }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-eye"
            aria-label="Ver ticket"
            @click="openView(row.original)"
          />

          <UDropdownMenu :items="getExpenseActions(row.original)">
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-ellipsis"
              aria-label="Acciones del gasto"
            />
          </UDropdownMenu>
        </div>
      </template>
    </UTable>
  </UCard>
</template>
