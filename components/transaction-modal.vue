<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { categories, transactionTypes } from '~/constants';
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'saved'): void;
}>();
const supabase = useSupabaseClient<any>();
const toast = useToast();

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
const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};
const state = reactive({ ...initialState });
const resetState = () => {
  Object.assign(state, initialState);
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetState();
    emit('update:modelValue', value);
  },
});

type Schema = z.output<typeof schema>;

const isLoading = ref<boolean>(false);
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;
  try {
    const { error } = await supabase.from('transactions').upsert(event.data);

    if (!error) {
      toast.add({
        title: 'Transaction added',
        icon: 'i-heroicons-check-circle',
        color: 'green',
      });

      isOpen.value = false;
      emit('saved');

      return;
    }

    throw error;
  } catch (e: any) {
    toast.add({
      title: 'Transaction added',
      description: e.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    });
  } finally {
    isLoading.value = false;
  }
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

        <UFormGroup label="Description" hint="Optional" name="description">
          <UInput v-model="state.description" placeholder="Description" />
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

        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<style lang="css" scoped></style>
