import React from 'react'
import { RecordForm } from './RecordForm'
import { RecordTable } from './RecordTable'
import { EmptyState } from '../common/EmptyState'
import { calculateTotals } from '../../utils/analytics'
import { formatNumber } from '../../utils/formatters'
import { ClipboardList, Database, Sparkles, PlusCircle } from 'lucide-react'

export function TrackerView({
  records,
  onAddRecord,
  onDeleteRecord,
  onExportCSV,
  onOpenImportCSV,
  onLoadDemo,
}) {
  const totals = calculateTotals(records)

  return (
    <div className="space-y-6">
      {/* Tracker Header & Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Recorded Logs
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {records.length}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              User-Entered Records
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {totals.userCount}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <PlusCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Simulated Demo Records
            </div>
            <div className="text-2xl font-extrabold text-slate-700 mt-1">
              {totals.demoCount}
            </div>
          </div>
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Record Entry Form */}
      <RecordForm onAddRecord={onAddRecord} />

      {/* Records Table */}
      {records.length > 0 ? (
        <RecordTable
          records={records}
          onDeleteRecord={onDeleteRecord}
          onExportCSV={onExportCSV}
          onOpenImportCSV={onOpenImportCSV}
          onLoadDemo={onLoadDemo}
        />
      ) : (
        <EmptyState onLoadDemo={onLoadDemo} />
      )}
    </div>
  )
}
