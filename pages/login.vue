<script setup lang="ts">
import { reactive, ref } from 'vue';
import { z } from 'zod';
const supabase = useSupabaseClient();
const success = ref<boolean>(false);
const pending = ref<boolean>(false);
const { toastError } = useAppToast();

useRedirectIfAuthenticated();

const schema = z.object({
  email: z.string().email('Invalid email'),
});

const state = reactive({ email: undefined });

const onSignIn = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: state.email,
      options: {
        emailRedirectTo: 'http://localhost:3000',
      },
    });

    if (error) {
      toastError({
        title: 'Error authenticating',
        description: error.message,
      });
    } else {
      success.value = true;
    }
  } catch (error) {
    toastError({
      title: 'Error authenticating',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSignIn">
    <UCard v-if="!success" class="space-y-4">
      <template #header> Sign-in to Finance Tracker </template>

      <UFormGroup
        label="Email"
        name="email"
        :required="true"
        help="You will receive an email with the confirmation link"
        class="mb-4"
      >
        <UInput v-model="state.email" type="email" placeholder="Email" />
      </UFormGroup>

      <UButton
        :loading="pending"
        :disabled="pending"
        type="submit"
        variant="solid"
        color="black"
        >Sign-in</UButton
      >
    </UCard>

    <UCard v-else>
      <template #header> Email has been sent </template>

      <div class="text-center">
        <p class="mb-4">
          We have sent an email to <strong>{{ state.email }}</strong> with a
          link to sign-in.
        </p>
        <p><strong>Important:</strong> The link will expire in 5 minutes</p>
      </div>
    </UCard>
  </UForm>
</template>

<style lang="css" scoped></style>
