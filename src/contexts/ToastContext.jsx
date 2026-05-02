import { createContext, useContext, useState, useCallback } from "react";
import "../css/component-css/Toast.css";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    const newToast = { id, message, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    
    // 1. Show active toast
    setToasts((prev) => [...prev, newToast]);
    
    // 2. Add to history (keep last 10)
    setHistory((prev) => [newToast, ...prev].slice(0, 10));

    // 3. Auto-remove active toast
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <ToastContext.Provider value={{ showToast, history, clearHistory }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} fade-in-right`}>
            <div className="toast-content">
              {toast.type === "success" ? "✅" : "❌"} {toast.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
