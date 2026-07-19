import Swal, {
  type SweetAlertIcon,
  type SweetAlertResult,
} from "sweetalert2";

import "sweetalert2/dist/sweetalert2.min.css";

const popupClass =
  "rounded-[1.5rem] border border-neutral-800 shadow-2xl";

const confirmButtonClass =
  "rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-black outline-none transition hover:bg-cyan-300";

const cancelButtonClass =
  "rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-semibold text-neutral-200 outline-none transition hover:bg-neutral-700";

export const stackAlert = Swal.mixin({
  background: "#111111",
  color: "#f5f5f5",
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: popupClass,
    title: "text-xl font-bold text-white",
    htmlContainer: "text-sm leading-6 text-neutral-300",
    confirmButton: confirmButtonClass,
    cancelButton: cancelButtonClass,
    actions: "gap-3",
  },
});

export function errorMessage(
  error: unknown,
  fallback = "No fue posible completar la operación."
): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

export async function confirmAction(options: {
  title: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  icon?: SweetAlertIcon;
  danger?: boolean;
}): Promise<SweetAlertResult> {
  const {
    title,
    text,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    icon = "question",
    danger = false,
  } = options;

  return stackAlert.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: popupClass,
      title: "text-xl font-bold text-white",
      htmlContainer: "text-sm leading-6 text-neutral-300",
      confirmButton: danger
        ? "rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white outline-none transition hover:bg-red-400"
        : confirmButtonClass,
      cancelButton: cancelButtonClass,
      actions: "gap-3",
    },
  });
}

export async function showInfo(options: {
  title: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  icon?: SweetAlertIcon;
}): Promise<SweetAlertResult> {
  return stackAlert.fire({
    icon: options.icon ?? "info",
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmText ?? "Entendido",
    cancelButtonText: options.cancelText ?? "Cerrar",
    showCancelButton: options.showCancelButton ?? false,
  });
}

export function showSuccessToast(
  title: string,
  text?: string
): Promise<SweetAlertResult> {
  return stackAlert.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title,
    text,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: {
      popup:
        "rounded-2xl border border-emerald-500/20 bg-[#111111] shadow-2xl",
      title: "text-sm font-bold text-white",
      htmlContainer: "text-xs text-neutral-400",
      timerProgressBar: "bg-emerald-400",
    },
  });
}

export function showErrorAlert(
  title: string,
  text: string
): Promise<SweetAlertResult> {
  return stackAlert.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Entendido",
  });
}
