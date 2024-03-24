<script setup lang="ts">
import { z } from 'zod';
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();

const pending = ref(false);
const state = reactive({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
});

const onSubmit = async () => {
  pending.value = true;
  try {
    const data = {
      data: { full_name: state.name },
    };

    if (state.email !== user.value.email) {
      Object.assign(data, { email: state.email });
    }

    const { error } = await supabase.auth.updateUser(data);

    if (error) throw error;
    toastSuccess({
      title: 'Profile updated',
      description: 'Your profile has been updated',
    });
  } catch (error: any) {
    toastError({
      title: 'Error updating profile',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UFormGroup name="name" label="Full name" class="mb-4">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup
      name="email"
      label="Email"
      class="mb-4"
      :required="true"
      help="You will receive an email on both the old and new addresses if you change it"
    >
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton
      :loading="pending"
      :disabled="pending"
      type="submit"
      color="black"
      variant="solid"
      label="Save"
    />
  </UForm>
</template>

<style lang="css" scoped></style>
