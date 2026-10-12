import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export function Toast({ toast, onClose }) {
  if (!toast) return null

  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'
  const isInfo = toast.type === 'info'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-elevated transition-all animate-bounce-in max-w-md">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
      {isInfo && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
      
      <p className="text-sm font-medium text-slate-800 leading-snug flex-1">
        {toast.message}
      </p>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
