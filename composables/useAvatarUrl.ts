export const useAvatarUrl = () => {
  const supabse = useSupabaseClient();
  const user = useSupabaseUser();

  const getPublicUrl = () => {
    if (!user.value?.user_metadata?.avatar_url) {
      return null;
    }

    const { data } = supabse.storage
      .from('avatars')
      .getPublicUrl(user.value?.user_metadata?.avatar_url);

    return data.publicUrl;
  };

  const url = ref(getPublicUrl());

  watch(user, () => (url.value = getPublicUrl()));

  return { url };
};
