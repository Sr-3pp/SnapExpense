<script setup lang="ts">
import type { TicketLineItem } from '~~/shared/types/ticket';

defineProps<{
  items: TicketLineItem[];
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
          Line Items
        </h3>
        <p class="text-sm text-(--ui-text-muted)">
          Review each parsed item before saving.
        </p>
      </div>

      <UButton
        type="button"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Add Item"
        @click="emit('add')"
      />
    </div>

    <div
      v-if="items.length"
      class="space-y-3"
    >
      <div
        v-for="(item, index) in items"
        :key="`item-${index}`"
        class="rounded-lg border border-(--ui-border) p-4"
      >
        <div class="mb-3 flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-(--ui-text-highlighted)">
            Item {{ index + 1 }}
          </p>

          <UButton
            type="button"
            size="xs"
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            @click="emit('remove', index)"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <UFormField :name="`items.${index}.name`" label="Name">
            <UInput v-model="item.name" class="w-full" />
          </UFormField>

          <UFormField :name="`items.${index}.quantity`" label="Quantity">
            <UInputNumber v-model="item.quantity" orientation="vertical" class="w-full" />
          </UFormField>

          <UFormField :name="`items.${index}.unitPrice`" label="Unit Price">
            <UInputNumber v-model="item.unitPrice" orientation="vertical" class="w-full" />
          </UFormField>

          <UFormField :name="`items.${index}.totalPrice`" label="Total Price">
            <UInputNumber v-model="item.totalPrice" orientation="vertical" class="w-full" />
          </UFormField>
        </div>
      </div>
    </div>

    <UAlert
      v-else
      color="neutral"
      variant="soft"
      title="No line items on this ticket yet."
    />
  </div>
</template>
