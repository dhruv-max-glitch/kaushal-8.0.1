import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Trash2,
  FileSpreadsheet,
  UploadCloud,
  Zap,
  Droplets,
  Trash,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { formatDate, formatNumber } from '../../utils/formatters'

export function RecordTable({ records, onDeleteRecord, onExportCSV, onOpenImportCSV, onLoadDemo }) {
  const [search, setSearch] = useState('')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [sortField, setSortField] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        if (resourceFilter !== 'all' && r.resourceType !== resourceFilter) return false
        if (sourceFilter !== 'all' && r.source !== sourceFilter) return false
        if (search.trim()) {
          const query = search.toLowerCase()
          const locMatch = (r.location || '').toLowerCase().includes(query)
          const notesMatch = (r.notes || '').toLowerCase().includes(query)
          const typeMatch = (r.resourceType || '').toLowerCase().includes(query)
          if (!locMatch && !notesMatch && !typeMatch) return false
        }
        return true
      })
      .sort((a, b) => {
        let valA = a[sortField]
        let valB = b[sortField]
        if (sortField === 'date') {
          valA = new Date(a.date).getTime()
          valB = new Date(b.date).getTime()
        } else if (sortField === 'quantity') {
          valA = Number(a.quantity)
          valB = Number(b.quantity)
        }
        if (sortOrder === 'asc') return valA > valB ? 1 : -1
        return valA < valB ? 1 : -1
      })
  }, [records, resourceFilter, sourceFilter, search, sortField, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const paginatedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by classroom, notes, or building..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Resource Filter */}
          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Resources</option>
            <option value="electricity">Electricity (kWh)</option>
            <option value="water">Water (Litres)</option>
            <option value="waste">Solid Waste (kg)</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Sources</option>
            <option value="user">User-Entered Only</option>
            <option value="demo">Simulated Demo Only</option>
          </select>

          {/* Import CSV */}
          {onOpenImportCSV && (
            <button
              onClick={onOpenImportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors shadow-xs"
              title="Import records from CSV file"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Import CSV</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th
                onClick={() => toggleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  {sortField === 'date' && (
                    <span className="text-emerald-700 font-mono text-[10px]">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3 px-4">Resource</th>
              <th
                onClick={() => toggleSort('quantity')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Quantity</span>
                  {sortField === 'quantity' && (
                    <span className="text-emerald-700 font-mono text-[10px]">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3 px-4">Location / Classroom</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4">Data Source</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {formatDate(rec.date)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-xs ${
                        rec.resourceType === 'electricity'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : rec.resourceType === 'water'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}
                    >
                      {rec.resourceType === 'electricity' && <Zap className="w-3.5 h-3.5" />}
                      {rec.resourceType === 'water' && <Droplets className="w-3.5 h-3.5" />}
                      {rec.resourceType === 'waste' && <Trash className="w-3.5 h-3.5" />}
                      <span className="capitalize">{rec.resourceType}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatNumber(rec.quantity)}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      {rec.resourceType === 'electricity' ? 'kWh' : rec.resourceType === 'water' ? 'L' : 'kg'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {rec.location || 'General Campus'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {rec.notes || <span className="text-slate-300 italic">No notes</span>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        rec.source === 'user'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {rec.source === 'user' ? 'User-Entered' : 'Simulated Demo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete this ${rec.resourceType} record (${rec.quantity})?`)) {
                          onDeleteRecord(rec.id)
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                  <p className="font-semibold text-slate-700 mb-1">No matching records found</p>
                  <p className="text-xs text-slate-400 mb-4">
                    Try adjusting search keywords or clearing active filters
                  </p>
                  <button
                    onClick={() => {
                      setSearch('')
                      setResourceFilter('all')
                      setSourceFilter('all')
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Reset Filter Parameters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing{' '}
          <strong className="text-slate-800">
            {filteredRecords.length === 0 ? 0 : (page - 1) * pageSize + 1}
          </strong>{' '}
          to{' '}
          <strong className="text-slate-800">
            {Math.min(page * pageSize, filteredRecords.length)}
          </strong>{' '}
          of <strong className="text-slate-800">{filteredRecords.length}</strong> filtered records
          (Total: {records.length})
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 text-slate-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
