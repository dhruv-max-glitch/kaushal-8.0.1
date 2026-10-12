import React from 'react'
import { Award, Leaf, TrendingUp, AlertCircle, Sparkles } from 'lucide-react'

export function SustainabilityScore({ scoreData, onViewInsights }) {
  const { score, tier, color, badge } = scoreData

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-forest-950 text-white rounded-2xl p-6 shadow-elevated relative overflow-hidden flex flex-col justify-between">
      {/* Decorative leaf watermarks */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
        <Leaf className="w-48 h-48 text-emerald-300" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Campus Green Score</span>
          </div>
          <span className="text-[11px] font-medium bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/20">
            Live Rating
          </span>
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-1">
              {score}
              <span className="text-xl sm:text-2xl font-bold text-emerald-300/80">/100</span>
            </div>
            <div className="text-sm font-semibold text-emerald-200 mt-1">
              Rating: <span className="text-white underline decoration-emerald-400 underline-offset-4">{tier}</span>
            </div>
          </div>

          <div className="flex-1 pb-1">
            <div className="w-full bg-emerald-950/80 h-3 rounded-full overflow-hidden border border-emerald-700/50 p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
          Status: <strong className="text-emerald-200">{badge}</strong>. 
          {score >= 75
            ? ' Good job! Your campus is saving energy and keeping resource wastage low.'
            : ' Keep monitoring electricity and water logs to improve this green score.'}
        </p>
      </div>

      <div className="pt-3 border-t border-emerald-800/60 flex items-center justify-between">
        <span className="text-[11px] text-emerald-300/80">
          Target: 85+ (Excellent)
        </span>
        {onViewInsights && (
          <button
            onClick={onViewInsights}
            className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-400/30 transition-all flex items-center gap-1.5"
          >
            <span>View Insights</span>
            <Leaf className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
