import React, { useState } from 'react'
import {
  calculatePeriodComparison,
  detectAnomalies,
  calculateTotals,
} from '../../utils/analytics'
import { formatNumber, formatDate } from '../../utils/formatters'
import { EmptyState } from '../common/EmptyState'
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Zap,
  Droplets,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'

export function SustainabilityInsightsView({
  records,
  onOpenExplainer,
  onNavigate,
  onLoadDemo,
  onAddRecord,
}) {
  const [windowDays, setWindowDays] = useState(7)

  if (!records || records.length === 0) {
    return <EmptyState onLoadDemo={onLoadDemo} onAddRecord={onAddRecord} />
  }

  const comparison = calculatePeriodComparison(records, windowDays)
  const anomalies = detectAnomalies(records)
  const totals = calculateTotals(records)

  return (
    <div className="space-y-6">
      {/* Top Insights Header & Controls */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Smart Campus Insights
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Weekly Usage Comparison
          </h3>
          <p className="text-xs text-slate-500">
            Comparing the last {windowDays} days with the {windowDays} days before that
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Window:</span>
            <select
              value={windowDays}
              onChange={(e) => setWindowDays(Number(e.target.value))}
              className="bg-transparent font-bold text-emerald-700 focus:outline-none"
            >
              <option value={7}>7 Days Window</option>
              <option value={14}>14 Days Window</option>
              <option value={30}>30 Days Window</option>
            </select>
          </div>

          <button
            onClick={onOpenExplainer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How It's Calculated</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Period Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Electricity Comparison */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Electricity (kWh)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Recent {windowDays}d:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {formatNumber(comparison.electricity.current)}
              </span>
              <span className="text-xs font-semibold text-slate-500 ml-1">kWh</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Prior {windowDays}d:</span>
              <span className="text-lg font-bold text-slate-500">
                {formatNumber(comparison.electricity.previous)}
              </span>
              <span className="text-xs text-slate-400 ml-1">kWh</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Usage Change:</span>
              {comparison.electricity.changeType === 'saving' ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -{comparison.electricity.changePercent}% Saved
                </span>
              ) : comparison.electricity.changeType === 'surge' ? (
                <span className="text-rose-700 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{comparison.electricity.changePercent}% Higher
                </span>
              ) : (
                <span className="text-slate-600">No Change</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {comparison.electricity.isReduction
                ? 'Great job! Electricity use went down during this period.'
                : 'Electricity went up. Check computer labs and AC units.'}
            </p>
          </div>
        </div>

        {/* Water Comparison */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Water (Litres)
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Recent {windowDays}d:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {formatNumber(comparison.water.current)}
              </span>
              <span className="text-xs font-semibold text-slate-500 ml-1">L</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Prior {windowDays}d:</span>
              <span className="text-lg font-bold text-slate-500">
                {formatNumber(comparison.water.previous)}
              </span>
              <span className="text-xs text-slate-400 ml-1">L</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Usage Change:</span>
              {comparison.water.changeType === 'saving' ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -{comparison.water.changePercent}% Saved
                </span>
              ) : comparison.water.changeType === 'surge' ? (
                <span className="text-rose-700 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{comparison.water.changePercent}% Higher
                </span>
              ) : (
                <span className="text-slate-600">No Change</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {comparison.water.isReduction
                ? 'Water use is down! Hostels and cafeterias saved well.'
                : 'Water use increased. Check washrooms and garden taps for leaks.'}
            </p>
          </div>
        </div>

        {/* Solid Waste Comparison */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Solid Waste (kg)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Recent {windowDays}d:</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {formatNumber(comparison.waste.current)}
              </span>
              <span className="text-xs font-semibold text-slate-500 ml-1">kg</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Prior {windowDays}d:</span>
              <span className="text-lg font-bold text-slate-500">
                {formatNumber(comparison.waste.previous)}
              </span>
              <span className="text-xs text-slate-400 ml-1">kg</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Usage Change:</span>
              {comparison.waste.changeType === 'saving' ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -{comparison.waste.changePercent}% Saved
                </span>
              ) : comparison.waste.changeType === 'surge' ? (
                <span className="text-rose-700 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{comparison.waste.changePercent}% Higher
                </span>
              ) : (
                <span className="text-slate-600">No Change</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {comparison.waste.isReduction
                ? 'Waste generated decreased! Keep recycling and composting.'
                : 'Waste increased. Encourage using dustbins and reducing single-use paper.'}
            </p>
          </div>
        </div>
      </div>

      {/* Anomaly Detection Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                High Usage Alerts (Spikes)
              </h4>
              <p className="text-xs text-slate-500">
                Highlights entries where resource usage was 35% higher than your campus average
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full self-start sm:self-auto">
            {anomalies.length} High Usage {anomalies.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        </div>

        {anomalies.length > 0 ? (
          <div className="space-y-3">
            {anomalies.map((anom, idx) => (
              <div
                key={anom.record.id || idx}
                className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {anom.record.location}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        • {formatDate(anom.record.date)}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        +{anom.percentageAbove}% Above Normal
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Logged: <strong className="text-slate-900">{formatNumber(anom.record.quantity)} {anom.record.resourceType === 'electricity' ? 'kWh' : anom.record.resourceType === 'water' ? 'L' : 'kg'}</strong> (Normal average: {anom.average} {anom.record.resourceType === 'electricity' ? 'kWh' : anom.record.resourceType === 'water' ? 'L' : 'kg'}).
                    </p>
                    {anom.record.notes && (
                      <p className="text-xs text-slate-500 italic mt-1">
                        Note: "{anom.record.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('charts')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-amber-800 border border-amber-300/80 rounded-xl shadow-sm transition-all whitespace-nowrap self-end sm:self-auto"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Inspect in Charts</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h5 className="font-bold text-slate-800 text-sm">Everything Looks Normal</h5>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All logged campus entries are within safe, normal levels without any unusual spikes.
            </p>
          </div>
        )}
      </div>

      {/* Target Savings Callout */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
            Savings Target
          </span>
          <h4 className="text-lg font-bold text-white mt-1">
            Calculate Campus Resource Savings
          </h4>
          <p className="text-xs text-emerald-200/90 max-w-xl mt-1 leading-relaxed">
            Set baseline targets and compare daily actuals to calculate your overall savings percentage.
          </p>
        </div>
        <button
          onClick={() => onNavigate('calculator')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <span>Open Savings Calculator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
