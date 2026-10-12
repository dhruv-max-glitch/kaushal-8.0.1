import React, { useState, useRef } from 'react'
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
} from 'lucide-react'
import { parseCSV, downloadCSVTemplate } from '../../utils/csvImporter'
import { formatDate, formatNumber } from '../../utils/formatters'

export function ImportCSVModal({ isOpen, onClose, onImportRecords }) {
  const [file, setFile] = useState(null)
  const [previewRecords, setPreviewRecords] = useState([])
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    processFile(selectedFile)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (!droppedFile) return
    processFile(droppedFile)
  }

  const processFile = (f) => {
    if (!f.name.endsWith('.csv')) {
      setError('Please select a valid .csv spreadsheet file')
      return
    }

    setFile(f)
    setError('')
    setIsProcessing(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result
        const parsed = parseCSV(text)
        setPreviewRecords(parsed)
      } catch (err) {
        setError(err.message || 'Failed to parse CSV file')
        setPreviewRecords([])
      } finally {
        setIsProcessing(false)
      }
    }
    reader.onerror = () => {
      setError('Error reading file from disk')
      setIsProcessing(false)
    }
    reader.readAsText(f)
  }

  const handleConfirmImport = () => {
    if (previewRecords.length === 0) return
    onImportRecords(previewRecords)
    handleClose()
  }

  const handleClose = () => {
    setFile(null)
    setPreviewRecords([])
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200/90 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Import Campus Resource Records
              </h3>
              <p className="text-xs text-slate-500">
                Upload CSV file from building sub-meter logs or utility records
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Download Template Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Need the proper column formatting?</span>
            </div>
            <button
              type="button"
              onClick={downloadCSVTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-200 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-600/30 hover:border-emerald-600 rounded-2xl p-8 text-center bg-emerald-50/20 hover:bg-emerald-50/40 cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              {file ? file.name : 'Click to select CSV or drag & drop here'}
            </h4>
            <p className="text-xs text-slate-500">
              Supports columns: Date, Resource Type, Quantity, Location/Classroom, Notes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview Table */}
          {previewRecords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Extracted Records Preview ({previewRecords.length} found):</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready to Import
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Resource</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRecords.slice(0, 10).map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2 font-medium">{formatDate(r.date)}</td>
                        <td className="p-2 capitalize text-emerald-700 font-semibold">{r.resourceType}</td>
                        <td className="p-2 font-bold text-slate-900">{formatNumber(r.quantity)}</td>
                        <td className="p-2 truncate max-w-[140px]">{r.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewRecords.length > 10 && (
                <p className="text-[11px] text-slate-400 text-center">
                  + {previewRecords.length - 10} additional rows parsed
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={previewRecords.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Import {previewRecords.length} Records</span>
          </button>
        </div>
      </div>
    </div>
  )
}
