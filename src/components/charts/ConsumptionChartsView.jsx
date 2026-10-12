import React, { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  formatTimeSeriesData,
  getZoneBreakdown,
  calculateTotals,
} from '../../utils/analytics'
import { formatNumber } from '../../utils/formatters'
import { EmptyState } from '../common/EmptyState'
import { BarChart3, Zap, Droplets, Trash2, PieChart as PieIcon, Layers } from 'lucide-react'

export function ConsumptionChartsView({ records, baselines, onLoadDemo, onAddRecord }) {
  const [activeMetric, setActiveMetric] = useState('electricity') // electricity | water | waste
  const [timeWindow, setTimeWindow] = useState('all') // all | 7d | 14d

  if (!records || records.length === 0) {
    return <EmptyState onLoadDemo={onLoadDemo} onAddRecord={onAddRecord} />
  }

  const allTimeSeries = formatTimeSeriesData(records)
  const timeSeries =
    timeWindow === '7d'
      ? allTimeSeries.slice(-7)
      : timeWindow === '14d'
      ? allTimeSeries.slice(-14)
      : allTimeSeries

  const zoneData = getZoneBreakdown(records, activeMetric).slice(0, 7)
  const totals = calculateTotals(records)

  // Baseline comparative daily data
  const targetBaseline = baselines[activeMetric] || 100
  const baselineComparisonData = timeSeries.map((d) => ({
    date: d.displayDate,
    actual: d[activeMetric] || 0,
    baseline: targetBaseline,
  }))

  // Pie chart carbon distribution data
  const pieData = [
    { name: 'Electricity (Grid)', value: Math.round(totals.electricity * 0.82), color: '#059669' },
    { name: 'Solid Waste (Landfill)', value: Math.round(totals.waste * 0.45), color: '#d97706' },
    { name: 'Water Pumping & Supply', value: Math.max(1, Math.round(totals.water * 0.0003)), color: '#0284c7' },
  ]

  const getMetricColor = () => {
    switch (activeMetric) {
      case 'electricity': return '#059669'
      case 'water': return '#0284c7'
      case 'waste': return '#d97706'
      default: return '#059669'
    }
  }

  const getUnit = () => {
    switch (activeMetric) {
      case 'electricity': return 'kWh'
      case 'water': return 'Litres'
      case 'waste': return 'kg'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Chart Controls Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Visual Usage Graphs
            </h3>
            <p className="text-xs text-slate-500">
              Select a resource to see daily trends and building comparisons
            </p>
          </div>
        </div>

        {/* Resource toggles & Range selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveMetric('electricity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeMetric === 'electricity'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Electricity</span>
            </button>
            <button
              onClick={() => setActiveMetric('water')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeMetric === 'water'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>Water</span>
            </button>
            <button
              onClick={() => setActiveMetric('waste')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeMetric === 'waste'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Waste</span>
            </button>
          </div>

          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Recorded Days</option>
            <option value="14d">Past 14 Days</option>
            <option value="7d">Past 7 Days</option>
          </select>
        </div>
      </div>

      {/* Top Chart: Daily Consumption Curve with Gradient */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-base capitalize">
              Daily {activeMetric === 'electricity' ? 'Electricity' : activeMetric === 'water' ? 'Water' : 'Waste'} Usage ({getUnit()})
            </h4>
            <p className="text-xs text-slate-500">
              Total campus consumption recorded day by day
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            Daily Target: <strong>{targetBaseline} {getUnit()}/day</strong>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="mainMetricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload
                    return (
                      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg border border-slate-700">
                        <p className="font-bold text-slate-200 mb-1">{d.date}</p>
                        <p className="font-semibold text-emerald-300">
                          {activeMetric.toUpperCase()}: {d[activeMetric]} {getUnit()}
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          {d.recordCount} observations recorded
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={getMetricColor()}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#mainMetricGrad)"
                name={`${activeMetric} (${getUnit()})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Building Comparison & Baseline Variance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Building & Classroom Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 text-base capitalize">
              Usage by Building / Area ({getUnit()})
            </h4>
            <p className="text-xs text-slate-500">
              Total {activeMetric} consumed per campus block or classroom
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={zoneData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="location"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  formatter={(val) => [`${formatNumber(val)} ${getUnit()}`, 'Total Usage']}
                />
                <Bar dataKey="total" fill={getMetricColor()} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Baseline vs Actual Bar Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 text-base">
              Actual Usage vs Target Goal ({getUnit()})
            </h4>
            <p className="text-xs text-slate-500">
              See whether daily usage stayed below your conservation target
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={baselineComparisonData.slice(-8)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [
                    `${formatNumber(val)} ${getUnit()}`,
                    name === 'actual' ? 'Actual Usage' : 'Target Goal',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar dataKey="actual" fill={getMetricColor()} name="Actual Usage" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" fill="#cbd5e1" name="Target Goal" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Carbon Contribution & Circular Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Carbon Footprint Breakdown (Estimated kg CO₂)
            </h4>
            <p className="text-xs text-slate-500">
              Estimated greenhouse impact from energy, waste, and water
            </p>
          </div>
          <div className="text-xs text-slate-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            Total Carbon: <strong>{formatNumber(totals.estimatedCarbonKg)} kg CO₂</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="h-56 md:col-span-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${formatNumber(val)} kg CO₂e`, 'Emissions Proxy']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="md:col-span-2 space-y-3">
            {pieData.map((item) => {
              const pct = totals.estimatedCarbonKg > 0 ? Math.round((item.value / totals.estimatedCarbonKg) * 100) : 0
              return (
                <div key={item.name} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{formatNumber(item.value)} kg CO₂e estimated</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">{pct}%</span>
                    <span className="text-[10px] text-slate-400 block">of footprint</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
