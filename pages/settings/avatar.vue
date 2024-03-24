<script setup lang="ts">
import { ref } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const { url } = useAvatarUrl();

const uploading = ref<boolean>(false);
const fileInput = ref();

const saveAvatar = async () => {
  const file = fileInput.value?.input?.files[0];

  if (!file) {
    toastError({ title: 'Please select an image' });
    return;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  try {
    uploading.value = true;

    // upload new avatar
    const { error, data } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) throw error;

    // update avatar url
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    // remove old avatar
    const currentAvatarUrl = user.value!.user_metadata?.avatar_url;
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl]);

      if (error) throw error;
    }

    fileInput.value.input.value = null;

    toastSuccess({ title: 'Avatar updated' });
  } catch (error: any) {
    toastError({ title: 'Error updating avatar', description: error.message });
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div class="mb-4">
    <UFormGroup
      label="Current Avatar"
      class="w-full"
      help="This would be blank by default"
    >
      <UAvatar
        :src="url ? url : 'https://avatars.githubusercontent.com/u/739984?v=4'"
        size="3xl"
    /></UFormGroup>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually change it"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      :loading="uploading"
      :disabled="uploading"
      type="submit"
      label="Save"
      color="black"
      variant="solid"
      @click="saveAvatar"
    />
  </div>
</template>

<style lang="css" scoped></style>
