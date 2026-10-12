import React, { useState } from 'react'
import {
  calculateSavingsMetric,
  calculateTotals,
  calculatePeriodComparison,
} from '../../utils/analytics'
import { formatNumber } from '../../utils/formatters'
import {
  Calculator,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Minus,
  Zap,
  Droplets,
  Trash2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react'

export function SavingsCalculatorView({
  records,
  baselines,
  onUpdateBaseline,
  onOpenExplainer,
}) {
  const comparison = calculatePeriodComparison(records, 7)
  const totals = calculateTotals(records)

  // Custom interactive simulator values
  const [activeResource, setActiveResource] = useState('electricity')
  const [customBaseline, setCustomBaseline] = useState('150')
  const [customCurrent, setCustomCurrent] = useState('120')

  // Live stored data comparison against user's set baselines
  const liveComparison = {
    electricity: calculateSavingsMetric(
      baselines.electricity,
      comparison.electricity.current / Math.max(1, comparison.windowDays)
    ),
    water: calculateSavingsMetric(
      baselines.water,
      comparison.water.current / Math.max(1, comparison.windowDays)
    ),
    waste: calculateSavingsMetric(
      baselines.waste,
      comparison.waste.current / Math.max(1, comparison.windowDays)
    ),
  }

  // Interactive custom calculation
  const customCalc = calculateSavingsMetric(customBaseline, customCurrent)

  const getUnit = (type = activeResource) => {
    switch (type) {
      case 'electricity': return 'kWh/day'
      case 'water': return 'Litres/day'
      case 'waste': return 'kg/day'
      default: return 'units/day'
    }
  }

  return (
    <div className="space-y-6">
      {/* Informational Guidance Banner */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-emerald-950">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-bold text-emerald-950">
            Daily Goal Tracking:
          </strong>{' '}
          Compare your daily campus usage with your target conservation goals. If you use less than the goal, it shows up as savings. If you use more, it shows the exact increase so you can plan where to cut back.
        </div>
      </div>

      {/* Formula Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                How Savings Are Calculated
              </h3>
              <p className="text-xs text-slate-500">
                We compare your Target Goal with your Actual Usage using a simple formula:
              </p>
            </div>
          </div>
          <button
            onClick={onOpenExplainer}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Methodology Details</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 font-mono text-center sm:text-left text-xs sm:text-sm text-slate-800">
          <span className="text-emerald-700 font-bold">Savings (%)</span> ={' '}
          <span className="text-slate-900">((Target Goal - Actual Usage) / Target Goal) × 100</span>
        </div>
      </div>

      {/* Live Campus Performance Against Configured Baselines */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Your Current Usage vs Target Goals
          </h3>
          <p className="text-xs text-slate-500">
            Adjust your daily goals below to see if your campus is currently saving or using more than expected
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Electricity Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">Electricity</span>
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Baseline Target:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={baselines.electricity}
                    onChange={(e) => onUpdateBaseline('electricity', e.target.value)}
                    className="w-16 px-1.5 py-0.5 text-right font-bold border rounded bg-white text-slate-800"
                  />
                  <span>kWh/d</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Recent Daily Avg:</span>
                <strong className="text-slate-900">
                  {formatNumber(comparison.electricity.current / Math.max(1, comparison.windowDays))} kWh/d
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              {liveComparison.electricity.isSavings ? (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Savings:</span>
                  </span>
                  <span>{liveComparison.electricity.savingsPercent}% Reduction</span>
                </div>
              ) : liveComparison.electricity.type === 'increase' ? (
                <div className="p-2 rounded-lg bg-rose-100 text-rose-900 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Surge:</span>
                  </span>
                  <span>+{liveComparison.electricity.savingsPercent}% Above Cap</span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold text-center">
                  At Baseline (0% Shift)
                </div>
              )}
            </div>
          </div>

          {/* Water Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">Water</span>
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Baseline Target:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={baselines.water}
                    onChange={(e) => onUpdateBaseline('water', e.target.value)}
                    className="w-16 px-1.5 py-0.5 text-right font-bold border rounded bg-white text-slate-800"
                  />
                  <span>L/d</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Recent Daily Avg:</span>
                <strong className="text-slate-900">
                  {formatNumber(comparison.water.current / Math.max(1, comparison.windowDays))} L/d
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              {liveComparison.water.isSavings ? (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Savings:</span>
                  </span>
                  <span>{liveComparison.water.savingsPercent}% Reduction</span>
                </div>
              ) : liveComparison.water.type === 'increase' ? (
                <div className="p-2 rounded-lg bg-rose-100 text-rose-900 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Surge:</span>
                  </span>
                  <span>+{liveComparison.water.savingsPercent}% Above Cap</span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold text-center">
                  At Baseline (0% Shift)
                </div>
              )}
            </div>
          </div>

          {/* Waste Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">Solid Waste</span>
              <Trash2 className="w-4 h-4 text-amber-600" />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Baseline Target:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={baselines.waste}
                    onChange={(e) => onUpdateBaseline('waste', e.target.value)}
                    className="w-16 px-1.5 py-0.5 text-right font-bold border rounded bg-white text-slate-800"
                  />
                  <span>kg/d</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Recent Daily Avg:</span>
                <strong className="text-slate-900">
                  {formatNumber(comparison.waste.current / Math.max(1, comparison.windowDays))} kg/d
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              {liveComparison.waste.isSavings ? (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Savings:</span>
                  </span>
                  <span>{liveComparison.waste.savingsPercent}% Reduction</span>
                </div>
              ) : liveComparison.waste.type === 'increase' ? (
                <div className="p-2 rounded-lg bg-rose-100 text-rose-900 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Surge:</span>
                  </span>
                  <span>+{liveComparison.waste.savingsPercent}% Above Cap</span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold text-center">
                  At Baseline (0% Shift)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive What-If Scenario Calculator */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            Interactive Scenario Simulator
          </h3>
          <p className="text-xs text-slate-500">
            Test arbitrary values to verify how the formula handles reductions, zero values, and consumption surges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Select Resource
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveResource('electricity')
                    setCustomBaseline('150')
                    setCustomCurrent('120')
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                    activeResource === 'electricity'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Electricity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveResource('water')
                    setCustomBaseline('1800')
                    setCustomCurrent('1450')
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                    activeResource === 'water'
                      ? 'border-sky-600 bg-sky-50 text-sky-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Water
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveResource('waste')
                    setCustomBaseline('50')
                    setCustomCurrent('38')
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                    activeResource === 'waste'
                      ? 'border-amber-600 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Waste
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Baseline Usage ({getUnit()})
                </label>
                <input
                  type="number"
                  step="any"
                  value={customBaseline}
                  onChange={(e) => setCustomBaseline(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Usage ({getUnit()})
                </label>
                <input
                  type="number"
                  step="any"
                  value={customCurrent}
                  onChange={(e) => setCustomCurrent(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 font-bold"
                />
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 self-center">Test presets:</span>
              <button
                type="button"
                onClick={() => {
                  setCustomBaseline('100')
                  setCustomCurrent('80')
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
              >
                20% Saving
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomBaseline('100')
                  setCustomCurrent('135')
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold"
              >
                +35% Surge
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomBaseline('0')
                  setCustomCurrent('50')
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
              >
                Zero Baseline Check
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Calculated Outcome
            </div>

            {customCalc.type === 'saving' && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>True Conservation Saving</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  {customCalc.savingsPercent}% Saved
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {customCalc.description}
                </p>
              </div>
            )}

            {customCalc.type === 'increase' && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Consumption Surge (No Savings)</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-rose-400">
                  +{customCalc.savingsPercent}% Surge
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {customCalc.description}
                </p>
              </div>
            )}

            {customCalc.type === 'equal' && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-semibold">
                  <Minus className="w-3.5 h-3.5" />
                  <span>Exact Baseline Match</span>
                </div>
                <div className="text-3xl font-extrabold text-white">0% Variance</div>
                <p className="text-xs text-slate-400">{customCalc.description}</p>
              </div>
            )}

            {customCalc.type === 'undefined' && (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Info className="w-3.5 h-3.5" />
                  <span>Invalid Baseline</span>
                </div>
                <div className="text-xl font-bold text-amber-400">Baseline = 0</div>
                <p className="text-xs text-slate-400">{customCalc.label}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Formula: (({customBaseline || 0} - {customCurrent || 0}) / {customBaseline || 1}) × 100
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
