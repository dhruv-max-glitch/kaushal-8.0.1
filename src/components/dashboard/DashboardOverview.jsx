import React from 'react'
import {
  calculateTotals,
  calculatePeriodComparison,
  calculateCampusEcoScore,
  detectAnomalies,
  formatTimeSeriesData,
} from '../../utils/analytics'
import { formatNumber, formatDate } from '../../utils/formatters'
import { MetricCard } from './MetricCard'
import { SustainabilityScore } from './SustainabilityScore'
import { EmptyState } from '../common/EmptyState'
import {
  AlertTriangle,
  ArrowRight,
  Zap,
  Droplets,
  Trash2,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export function DashboardOverview({
  records,
  onNavigate,
  onOpenAddModal,
  onLoadDemo,
}) {
  if (!records || records.length === 0) {
    return <EmptyState onLoadDemo={onLoadDemo} onAddRecord={onOpenAddModal} />
  }

  const totals = calculateTotals(records)
  const comparison = calculatePeriodComparison(records, 7)
  const scoreData = calculateCampusEcoScore(records)
  const anomalies = detectAnomalies(records)
  const timeSeries = formatTimeSeriesData(records).slice(-10) // recent 10 days

  // Recent 5 logs
  const recentRecords = [...records].slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Top Anomaly Alert Banner if spikes detected */}
      {anomalies.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-sm animate-fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Notice: {anomalies.length} High Usage {anomalies.length === 1 ? 'Spike' : 'Spikes'} Detected
              </h4>
              <p className="text-xs text-amber-800/90">
                Unusual spike at <strong>{anomalies[0].record.location}</strong>: recorded{' '}
                <strong>{anomalies[0].record.quantity} {anomalies[0].record.resourceType === 'electricity' ? 'kWh' : anomalies[0].record.resourceType === 'water' ? 'L' : 'kg'}</strong> ({anomalies[0].reason}).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('insights')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <span>See What Happened</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          title="Electricity"
          value={formatNumber(totals.electricity)}
          unit="kWh"
          resourceType="electricity"
          comparison={comparison.electricity}
          onClick={() => onNavigate('charts')}
        />
        <MetricCard
          title="Water"
          value={formatNumber(totals.water)}
          unit="Litres"
          resourceType="water"
          comparison={comparison.water}
          onClick={() => onNavigate('charts')}
        />
        <MetricCard
          title="Solid Waste"
          value={formatNumber(totals.waste)}
          unit="kg"
          resourceType="waste"
          comparison={comparison.waste}
          onClick={() => onNavigate('charts')}
        />
        <MetricCard
          title="Carbon Footprint"
          value={formatNumber(totals.estimatedCarbonKg)}
          unit="kg CO₂e"
          resourceType="carbon"
          subtitle={`${records.length} logs recorded across campus`}
          onClick={() => onNavigate('insights')}
        />
      </div>

      {/* Score and Trend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campus Eco Performance Index */}
        <div className="lg:col-span-1">
          <SustainabilityScore
            scoreData={scoreData}
            onViewInsights={() => onNavigate('insights')}
          />
        </div>

        {/* Right Column: 10-Day Quick Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Recent Daily Consumption Trend
              </h3>
              <p className="text-xs text-slate-500">
                Electricity (kWh) and Solid Waste (kg) over recent recorded days
              </p>
            </div>
            <button
              onClick={() => onNavigate('charts')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Detailed Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg border border-slate-700 space-y-1">
                          <p className="font-bold text-slate-200">{data.date}</p>
                          <p className="text-emerald-300">⚡ Electricity: {data.electricity} kWh</p>
                          <p className="text-sky-300">💧 Water: {data.water} L</p>
                          <p className="text-amber-300">🗑️ Waste: {data.waste} kg</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="electricity"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#elecGrad)"
                  name="Electricity (kWh)"
                />
                <Area
                  type="monotone"
                  dataKey="waste"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#wasteGrad)"
                  name="Waste (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              Electricity (kWh)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              Waste (kg)
            </span>
            <span className="text-slate-400">
              💧 Water tracked on full charts view
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Grid: Recent Records & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Records list */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Recent Campus Logs
              </h3>
              <p className="text-xs text-slate-500">
                Latest observations logged by campus staff & faculty
              </p>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All ({records.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {formatDate(r.date)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[11px] ${
                          r.resourceType === 'electricity'
                            ? 'bg-emerald-50 text-emerald-700'
                            : r.resourceType === 'water'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {r.resourceType === 'electricity' && <Zap className="w-3 h-3" />}
                        {r.resourceType === 'water' && <Droplets className="w-3 h-3" />}
                        {r.resourceType === 'waste' && <Trash2 className="w-3 h-3" />}
                        <span className="capitalize">{r.resourceType}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {formatNumber(r.quantity)}{' '}
                      <span className="text-[10px] font-normal text-slate-500">
                        {r.resourceType === 'electricity' ? 'kWh' : r.resourceType === 'water' ? 'L' : 'kg'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px]">
                      {r.location || 'General'}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          r.source === 'user'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.source === 'user' ? 'User-Entered' : 'Simulated'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tools & Calculator Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-700">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Quick Tools
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Explore Tools
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Quickly jump to log daily records, inspect visual trends, or calculate your savings.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('tracker')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Usage Tracker
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Log daily resource entries or import CSV
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => onNavigate('charts')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Visual Usage Graphs
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Day-by-day charts and building breakdowns
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => onNavigate('calculator')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Savings Calculator
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Compare usage against baseline goals
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>GreenPulse Sustainability Engine</span>
            <span className="font-semibold text-emerald-700">Campus Status: Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
