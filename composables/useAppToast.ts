export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: (content: { title: string; description?: string }) => {
      toast.add({
        ...content,
        icon: 'i-heroicons-check-circle',
        color: 'green',
      });
    },
    toastError: (content: { title: string; description?: string }) => {
      toast.add({
        ...content,
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      });
    },
  };
};
