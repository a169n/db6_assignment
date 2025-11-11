import { toast } from 'sonner';

type ToastVariant = 'success' | 'error' | 'info';

export const showToast = (variant: ToastVariant, message: string) => {
  let toastId: string | number = '';
  toastId = toast[variant](message, {
    action: {
      label: 'Dismiss',
      onClick: () => toast.dismiss(toastId)
    }
  });
  return toastId;
};
