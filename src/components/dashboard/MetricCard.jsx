import React from 'react'
import {
  Zap,
  Droplets,
  Trash2,
  Leaf,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

export function MetricCard({
  title,
  value,
  unit,
  resourceType,
  comparison,
  subtitle,
  onClick,
}) {
  const getIcon = () => {
    switch (resourceType) {
      case 'electricity':
        return <Zap className="w-5 h-5 text-emerald-600" />
      case 'water':
        return <Droplets className="w-5 h-5 text-sky-600" />
      case 'waste':
        return <Trash2 className="w-5 h-5 text-amber-600" />
      default:
        return <Leaf className="w-5 h-5 text-teal-600" />
    }
  }

  const getBgStyle = () => {
    switch (resourceType) {
      case 'electricity':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'water':
        return 'bg-sky-50 text-sky-700 border-sky-100'
      case 'waste':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      default:
        return 'bg-teal-50 text-teal-700 border-teal-100'
    }
  }

  const isReduction = comparison?.isReduction
  const changePercent = comparison?.changePercent || 0
  const changeType = comparison?.changeType || 'neutral'

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-soft hover:border-emerald-500/30' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${getBgStyle()}`}>
          {getIcon()}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        <span className="text-sm font-semibold text-slate-500">
          {unit}
        </span>
      </div>

      {comparison ? (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {changeType === 'saving' && (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{changePercent}% lower</span>
            </span>
          )}
          {changeType === 'surge' && (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{changePercent}% surge</span>
            </span>
          )}
          {changeType === 'neutral' && (
            <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              <Minus className="w-3.5 h-3.5" />
              <span>0% change</span>
            </span>
          )}
          <span className="text-slate-400 truncate">vs prior 7 days</span>
        </div>
      ) : (
        <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 truncate">
          {subtitle || 'Campus total recorded'}
        </p>
      )}
    </div>
  )
}
