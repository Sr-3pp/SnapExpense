<script setup lang="ts">
import type { ExpenseRecord } from '~~/shared/types/expense';

const props = defineProps<{
  expense: ExpenseRecord | null;
}>();

const emit = defineEmits<{
  closed: [];
}>();

const { isOpen, close } = useModal('viewExpense');

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC'
});

const formatDateTime = (value: string) => {
  return dateTimeFormatter.format(new Date(value));
};

const formatAmount = (value: number | null, currency: string | null) => {
  if (value === null) {
    return 'No detectado';
  }

  if (!currency) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const closeModal = () => {
  close();
  emit('closed');
};

const summaryItems = computed(() => {
  if (!props.expense) {
    return [];
  }

  return [
    {
      label: 'Fecha de compra',
      value: props.expense.purchaseDate ?? 'No detectado'
    },
    {
      label: 'Pago',
      value: props.expense.paymentMethod
    },
    {
      label: 'Subtotal',
      value: formatAmount(props.expense.subtotal, props.expense.currency)
    },
    {
      label: 'Impuesto',
      value: formatAmount(props.expense.tax, props.expense.currency)
    }
  ];
});

const metadataItems = computed(() => {
  if (!props.expense) {
    return [];
  }

    return [
      {
        label: 'Numero de factura',
        value: props.expense.invoiceNumber ?? 'No detectado'
      },
      {
        label: 'Moneda',
        value: props.expense.currency ?? 'No detectado'
      },
      {
        label: 'Creado',
        value: formatDateTime(props.expense.createdAt)
      },
      {
        label: 'Actualizado',
        value: formatDateTime(props.expense.updatedAt)
      }
  ];
});
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :content="{ class: 'sm:max-w-3xl' }"
    title="Detalle del ticket"
    description="Revisa los campos extraidos, los articulos y las notas asociadas a este gasto."
    @update:open="!$event && emit('closed')"
  >
    <template #body>
      <div
        v-if="expense"
        class="space-y-6"
      >
        <section class="rounded-2xl border border-default bg-[radial-gradient(circle_at_top_left,var(--ui-primary-100),transparent_42%),radial-gradient(circle_at_top_right,var(--ui-secondary-100),transparent_36%),var(--ui-bg-elevated)] p-5">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div class="space-y-3 rounded-2xl bg-default/90 p-4 backdrop-blur-sm">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge color="neutral" variant="subtle">
                  Ticket
                </UBadge>
                <UBadge
                  v-if="expense.currency"
                  color="primary"
                  variant="subtle"
                >
                  {{ expense.currency }}
                </UBadge>
              </div>

              <div>
                <h2 class="text-2xl font-semibold text-(--ui-text-highlighted)">
                  {{ expense.merchant || 'Comercio desconocido' }}
                </h2>
                <p class="mt-1 text-sm text-(--ui-text-muted)">
                  {{ expense.purchaseDate || 'Fecha de compra no detectada' }}
                </p>
              </div>
            </div>

            <div class="rounded-2xl border border-default bg-default px-4 py-3 text-right shadow-sm">
              <p class="text-xs font-medium uppercase tracking-[0.18em] text-(--ui-text-muted)">
                Total
              </p>
              <p class="mt-1 text-3xl font-semibold text-(--ui-text-highlighted)">
                {{ formatAmount(expense.total, expense.currency) }}
              </p>
            </div>
          </div>
        </section>

        <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="item in summaryItems"
            :key="item.label"
            class="rounded-xl border border-default bg-(--ui-bg-elevated) p-4"
          >
            <p class="text-xs font-medium uppercase tracking-[0.14em] text-(--ui-text-muted)">
              {{ item.label }}
            </p>
            <p class="mt-2 text-sm font-medium text-(--ui-text-highlighted)">
              {{ item.value }}
            </p>
          </div>
        </section>

        <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-(--ui-text-highlighted)">
                Metadatos del ticket
              </h3>
              <p class="text-sm text-(--ui-text-muted)">
                Campos extraidos y fechas de persistencia.
              </p>
            </div>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div
              v-for="item in metadataItems"
              :key="item.label"
              class="rounded-xl border border-default bg-default px-4 py-3"
            >
              <p class="text-xs font-medium uppercase tracking-[0.14em] text-(--ui-text-muted)">
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm text-(--ui-text-highlighted)">
                {{ item.value }}
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-(--ui-text-highlighted)">
                Articulos
              </h3>
              <p class="text-sm text-(--ui-text-muted)">
                Compras individuales extraidas del ticket.
              </p>
            </div>
            <UBadge color="neutral" variant="subtle">
              {{ expense.items.length }} articulo{{ expense.items.length === 1 ? '' : 's' }}
            </UBadge>
          </div>

          <div
            v-if="expense.items.length"
            class="mt-4 overflow-hidden rounded-xl border border-default"
          >
            <div class="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-3 bg-default px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-(--ui-text-muted)">
              <span>Articulo</span>
              <span>Cant.</span>
              <span>Unitario</span>
              <span>Total</span>
            </div>

            <div
              v-for="(item, index) in expense.items"
              :key="`${item.name}-${index}`"
              class="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] gap-3 border-t border-default px-4 py-3 text-sm"
            >
              <span class="font-medium text-(--ui-text-highlighted)">
                {{ item.name }}
              </span>
              <span class="text-(--ui-text-muted)">
                {{ item.quantity ?? '-' }}
              </span>
              <span class="text-(--ui-text-muted)">
                {{ formatAmount(item.unitPrice, expense.currency) }}
              </span>
              <span class="text-(--ui-text-highlighted)">
                {{ formatAmount(item.totalPrice, expense.currency) }}
              </span>
            </div>
          </div>

          <div
            v-else
            class="mt-4 rounded-xl border border-dashed border-default bg-default px-4 py-6 text-sm text-(--ui-text-muted)"
          >
            No se extrajeron articulos para este ticket.
          </div>
        </section>

        <section class="rounded-2xl border border-default bg-(--ui-bg-elevated) p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-(--ui-text-highlighted)">
                Notas de extraccion
              </h3>
              <p class="text-sm text-(--ui-text-muted)">
                Incertidumbre del OCR y observaciones del modelo.
              </p>
            </div>
          </div>

          <ul
            v-if="expense.notes.length"
            class="mt-4 space-y-3"
          >
            <li
              v-for="(note, index) in expense.notes"
              :key="`${note}-${index}`"
              class="rounded-xl border border-default bg-default px-4 py-3 text-sm text-(--ui-text-highlighted)"
            >
              {{ note }}
            </li>
          </ul>

          <div
            v-else
            class="mt-4 rounded-xl border border-dashed border-default bg-default px-4 py-6 text-sm text-(--ui-text-muted)"
          >
            No se registraron notas de extraccion para este ticket.
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton
          color="neutral"
          variant="soft"
          label="Cerrar"
          @click="closeModal"
        />
      </div>
    </template>
  </UModal>
</template>
