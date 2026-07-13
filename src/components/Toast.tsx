'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const DURATION = 4500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = nextId.current++;
      // Cap the stack. Without this, a user mashing a button buries the screen.
      setToasts((t) => [...t.slice(-2), { id, message, variant }]);
      timers.current.set(id, setTimeout(() => dismiss(id), DURATION));
    },
    [dismiss],
  );

  // Every pending timer must be cleared on unmount, or a dismiss fires against
  // a gone component.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const api = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (m: string) => toast(m, 'success'),
      error: (m: string) => toast(m, 'error'),
      info: (m: string) => toast(m, 'info'),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* aria-live="polite" so a toast is announced without interrupting whatever
          the user is doing. Errors carry role="alert" individually, which is
          assertive — the one case worth interrupting for. */}
      <div className="toast-viewport" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast toast--${t.variant}`}
            role={t.variant === 'error' ? 'alert' : undefined}
          >
            <span className="toast-icon" aria-hidden="true">
              {t.variant === 'success' ? '✓' : t.variant === 'error' ? '!' : 'i'}
            </span>
            <span className="toast-msg">{t.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
