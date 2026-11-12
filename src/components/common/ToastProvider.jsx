import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const icons   = { success: '✅', error: '❌', info: 'ℹ️' };
  const accents = {
    success: 'border-l-4 border-l-green-500',
    error:   'border-l-4 border-l-red-500',
    info:    'border-l-4 border-l-blue-500',
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`anim-toast flex items-center gap-3 bg-zinc-900 border border-zinc-800 ${accents[t.type]} rounded-lg px-4 py-3 min-w-[280px] shadow-2xl pointer-events-auto`}
          >
            <span className="text-lg">{icons[t.type]}</span>
            <span className="text-sm font-medium text-white flex-1">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
