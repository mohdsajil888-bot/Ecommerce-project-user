import { AlertTriangle, X } from "lucide-react";

const VARIANT_STYLES = {
  danger: {
    iconWrap: "bg-red-500/10",
    iconColor: "text-red-400",
    button: "bg-red-600 hover:bg-red-500 text-white",
  },
  warning: {
    iconWrap: "bg-amber-500/10",
    iconColor: "text-amber-400",
    button: "bg-amber-500 hover:bg-amber-400 text-black",
  },
  success: {
    iconWrap: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
};

/** Reusable admin confirmation popup modal. */
export default function ConfirmModal({
  open,
  title,
  subtitle = "Please confirm this action",
  message,
  confirmLabel = "Confirm",
  loadingLabel = "Please wait...",
  variant = "warning",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.warning;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b130e] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${styles.iconWrap}`}
            >
              <AlertTriangle size={25} className={styles.iconColor} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="mt-1 text-xs text-stone-400">{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 leading-6 text-stone-300">{message}</div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-semibold text-stone-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles.button}`}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
