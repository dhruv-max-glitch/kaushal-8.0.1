import React from 'react'
import { Leaf, PlusCircle, Database } from 'lucide-react'

export function EmptyState({ onLoadDemo, onAddRecord }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
        <Leaf className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">No Campus Records Yet</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        Start tracking electricity, water, and solid waste to see live consumption insights, anomaly detection, and savings analytics.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm shadow-sm transition-all"
          >
            <Database className="w-4 h-4" />
            Load Sample Demo Data
          </button>
        )}
        {onAddRecord && (
          <button
            onClick={onAddRecord}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Record
          </button>
        )}
      </div>
    </div>
  )
}
