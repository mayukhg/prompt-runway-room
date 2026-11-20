import type { ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

const RELAY_TOAST_ID = "relay-demo-toast";
const replace = (options?: ExternalToast): ExternalToast => ({ ...options, id: RELAY_TOAST_ID });

function notify(message: ReactNode, options?: ExternalToast) {
  return sonnerToast(message, replace(options));
}

export const toast = Object.assign(notify, {
  success: (message: ReactNode, options?: ExternalToast) => sonnerToast.success(message, replace(options)),
  error: (message: ReactNode, options?: ExternalToast) => sonnerToast.error(message, replace(options)),
  warning: (message: ReactNode, options?: ExternalToast) => sonnerToast.warning(message, replace(options)),
  info: (message: ReactNode, options?: ExternalToast) => sonnerToast.info(message, replace(options)),
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
});
