import React, { useState } from 'react'
import { X, Zap, Droplets, Trash2, Calendar, MapPin, FileText, CheckCircle2 } from 'lucide-react'
import { CAMPUS_LOCATIONS } from '../../data/demoRecords'

export function QuickActionModal({ isOpen, onClose, onAddRecord }) {
  const [resourceType, setResourceType] = useState('electricity')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0])
  const [customLocation, setCustomLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const getUnit = () => {
    switch (resourceType) {
      case 'electricity': return 'kWh'
      case 'water': return 'Litres'
      case 'waste': return 'kg'
      default: return 'units'
    }
  }

  const validate = () => {
    const errs = {}
    const num = parseFloat(quantity)
    if (!quantity || isNaN(num) || num <= 0) {
      errs.quantity = 'Please enter a positive numeric quantity'
    }
    if (!date) {
      errs.date = 'Please pick a valid date'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const selectedLoc = location === 'Custom...' ? customLocation : location

    onAddRecord({
      resourceType,
      quantity,
      date,
      location: selectedLoc || 'General Campus',
      notes,
    })

    // Reset fields
    setQuantity('')
    setNotes('')
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200/90 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Log Campus Resource Record
            </h3>
            <p className="text-xs text-slate-500">
              Save daily consumption data into browser localStorage
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Resource selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Resource Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setResourceType('electricity')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  resourceType === 'electricity'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Zap className="w-5 h-5 mb-1 text-emerald-600" />
                <span>Electricity</span>
                <span className="text-[10px] text-slate-400 font-normal">kWh</span>
              </button>

              <button
                type="button"
                onClick={() => setResourceType('water')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  resourceType === 'water'
                    ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Droplets className="w-5 h-5 mb-1 text-sky-600" />
                <span>Water</span>
                <span className="text-[10px] text-slate-400 font-normal">Litres</span>
              </button>

              <button
                type="button"
                onClick={() => setResourceType('waste')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  resourceType === 'waste'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Trash2 className="w-5 h-5 mb-1 text-amber-600" />
                <span>Solid Waste</span>
                <span className="text-[10px] text-slate-400 font-normal">kg</span>
              </button>
            </div>
          </div>

          {/* Quantity & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Quantity ({getUnit()}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 125.5"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }))
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                    errors.quantity ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                  {getUnit()}
                </span>
              </div>
              {errors.quantity && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date of Observation *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    if (errors.date) setErrors((prev) => ({ ...prev, date: null }))
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                    errors.date ? 'border-rose-400' : 'border-slate-200'
                  }`}
                  required
                />
              </div>
              {errors.date && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Location / Classroom */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Classroom / Campus Location (Optional)
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-white"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="Custom...">Custom / Other Classroom...</option>
            </select>

            {location === 'Custom...' && (
              <input
                type="text"
                placeholder="Enter custom classroom or building name..."
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Context Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Conducted during annual tech symposium; 4 ACs active in Lab 102."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
