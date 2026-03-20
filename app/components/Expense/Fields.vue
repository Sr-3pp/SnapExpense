<script setup lang="ts">
import type { PaymentMethodOption } from '~~/shared/constants/payment-methods';
import type { TicketExtraction } from '~~/shared/types/ticket';

import { paymentMethodOptions } from '~~/shared/constants/payment-methods';

const props = defineProps<{
  state: TicketExtraction;
}>();

const updateNullableString = (
  key: 'merchant' | 'purchaseDate' | 'currency' | 'invoiceNumber',
  value: string | undefined
) => {
  props.state[key] = value ?? null;
};

const updatePaymentMethod = (value: PaymentMethodOption | null | undefined) => {
  props.state.paymentMethod = value ?? null;
};
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <UFormField name="merchant" label="Comercio">
      <UInput
        :model-value="state.merchant ?? undefined"
        class="w-full"
        @update:model-value="updateNullableString('merchant', $event)"
      />
    </UFormField>

    <UFormField name="purchaseDate" label="Fecha de compra">
      <UInput
        :model-value="state.purchaseDate ?? undefined"
        type="date"
        class="w-full"
        @update:model-value="updateNullableString('purchaseDate', $event)"
      />
    </UFormField>

    <UFormField name="currency" label="Moneda">
      <UInput
        :model-value="state.currency ?? undefined"
        class="w-full"
        @update:model-value="updateNullableString('currency', $event)"
      />
    </UFormField>

    <UFormField name="paymentMethod" label="Metodo de pago">
      <USelect
        :items="[...paymentMethodOptions]"
        :model-value="state.paymentMethod ?? undefined"
        placeholder="Selecciona un metodo de pago"
        nullable
        class="w-full"
        @update:model-value="updatePaymentMethod($event)"
      />
    </UFormField>

    <UFormField name="invoiceNumber" label="Numero de factura">
      <UInput
        :model-value="state.invoiceNumber ?? undefined"
        class="w-full"
        @update:model-value="updateNullableString('invoiceNumber', $event)"
      />
    </UFormField>

    <div class="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <UFormField name="subtotal" label="Subtotal">
        <UInputNumber v-model="state.subtotal" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField name="tax" label="Impuesto">
        <UInputNumber v-model="state.tax" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField name="tip" label="Propina">
        <UInputNumber v-model="state.tip" orientation="vertical" class="w-full" />
      </UFormField>

      <UFormField name="total" label="Total">
        <UInputNumber v-model="state.total" orientation="vertical" class="w-full" />
      </UFormField>
    </div>
  </div>
</template>
