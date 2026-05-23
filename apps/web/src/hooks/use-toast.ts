import { create } from "zustand";
import type { ToastProps } from "@/components/ui/toast";
import { UI_CONSTANTS } from "@/constants/ui.constants";

type ToastData = Omit<ToastProps, "id" | "onClose">;

interface ToastState {
  toasts: ToastProps[];
  addToast: (toast: ToastData) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toastData) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastProps = {
      ...toastData,
      id,
      onClose: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, UI_CONSTANTS.TOAST_DURATION);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
