import { toast } from 'sonner';
export const showToast = (variant, message) => {
    let toastId = '';
    toastId = toast[variant](message, {
        action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(toastId)
        }
    });
    return toastId;
};
