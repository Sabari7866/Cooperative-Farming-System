import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

type Subscriber = (toasts: ToastItem[]) => void;

// Module-level toast store for simple, provider-less usage
const toastStore: { toasts: ToastItem[]; subs: Subscriber[] } = {
  toasts: [],
  subs: [],
};

function notify() {
  toastStore.subs.forEach((fn) => fn([...toastStore.toasts]));
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(toastStore.toasts);

  useEffect(() => {
    const sub: Subscriber = (next) => setToasts(next);
    toastStore.subs.push(sub);
    return () => {
      toastStore.subs = toastStore.subs.filter((s) => s !== sub);
    };
  }, []);

  function addToast(t: Omit<ToastItem, 'id'>) {
    const item: ToastItem = { ...t, id: Date.now().toString() };
    toastStore.toasts = [item, ...toastStore.toasts].slice(0, 5);
    notify();
    // Auto-dismiss after 3.5s
    window.setTimeout(() => removeToast(item.id), 3500);
  }

  function removeToast(id: string) {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
    notify();
  }

  return { toasts, addToast, removeToast };
}

export const ToastContainer = ({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) => {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[260px] max-w-sm rounded-lg shadow-lg border px-4 py-3 bg-white ${
            t.type === 'success'
              ? 'border-green-200'
              : t.type === 'error'
                ? 'border-red-200'
                : 'border-blue-200'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{t.title}</p>
              <p className="text-sm text-gray-600">{t.message}</p>
            </div>
            <button
              onClick={() => onClose(t.id)}
              className="ml-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
