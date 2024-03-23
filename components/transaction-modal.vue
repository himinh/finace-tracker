<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { categories, transactionTypes } from '~/constants';
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0'),
});
const incomeSchema = z.object({
  type: z.literal('Income'),
});
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories),
});
const investmentSchema = z.object({
  type: z.literal('Investment'),
});
const savingSchema = z.object({
  type: z.literal('Saving'),
});
const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);

const state = reactive({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const onSubmit = async () => {
  console.log(state);
};
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UForm
        @submit="onSubmit"
        :state="state"
        :schema="schema"
        class="space-y-4"
      >
        <UFormGroup label="Transaction type" :required="true" name="type">
          <USelect
            v-model="state.type"
            :options="transactionTypes"
            placeholder="Select the transaction type"
          />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount">
          <UInput
            v-model.number="state.amount"
            type="number"
            placeholder="Amount"
          />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at">
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-heroicons-calendar-day-20-solid"
          />
        </UFormGroup>

        <UFormGroup
          v-model="state.description"
          label="Description"
          hint="Optional"
          name="description"
        >
          <UInput placeholder="Description" />
        </UFormGroup>

        <UFormGroup
          label="Category"
          :required="true"
          name="category"
          v-if="state.type === 'Expense'"
        >
          <USelect
            v-model="state.category"
            :options="categories"
            placeholder="Category"
          />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" />
      </UForm>
    </UCard>
  </UModal>
</template>

<style lang="css" scoped></style>
