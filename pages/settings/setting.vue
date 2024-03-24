<script setup lang="ts">
import { reactive } from 'vue';
import { z } from 'zod';
import { transactionViewOptions } from '~/constants';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();
const pending = ref<boolean>(false);
const state = reactive({
  transactionView:
    user.value.user_metadata?.transaction_view ?? transactionViewOptions[1],
});
const schema = z.object({
  transactionView: z.enum(transactionViewOptions),
});

const onSubmit = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.transactionView,
      },
    });

    if (error) throw error;
    toastSuccess({
      title: 'Setting updated',
    });
  } catch (error: any) {
    toastError({
      title: 'Error updating settings',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <UForm @submit="onSubmit" :state="state" :schema="schema">
    <UFormGroup
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to see your transactions"
    >
      <USelect
        v-model="state.transactionView"
        :options="transactionViewOptions"
      />
    </UFormGroup>

    <UButton
      :loading="pending"
      type="submit"
      color="black"
      variant="solid"
      label="Save"
    />
  </UForm>
</template>

<style lang="css" scoped></style>
