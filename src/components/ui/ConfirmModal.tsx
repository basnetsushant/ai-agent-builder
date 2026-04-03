interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  onClose: () => void;
}

function ConfirmModal({ open, title, message, onConfirm, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-900 rounded-xl p-6 w-[90%] max-w-md shadow-xl border border-slate-800">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>

        <p className="text-sm text-slate-400 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-slate-700 rounded-md hover:bg-slate-600 text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-violet-600 rounded-md hover:bg-violet-500 text-white cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmModal;
