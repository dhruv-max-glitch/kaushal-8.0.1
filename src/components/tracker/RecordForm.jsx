import React, { useState } from 'react'
import { Zap, Droplets, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react'
import { CAMPUS_LOCATIONS } from '../../data/demoRecords'

export function RecordForm({ onAddRecord }) {
  const [resourceType, setResourceType] = useState('electricity')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0])
  const [customLocation, setCustomLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [justAdded, setJustAdded] = useState(false)

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
      errs.quantity = 'Please enter a valid positive number'
    }
    if (!date) {
      errs.date = 'Date is required'
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

    setQuantity('')
    setNotes('')
    setErrors({})
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 3000)
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Add Daily Usage Record
          </h3>
          <p className="text-xs text-slate-500">
            Enter electricity, water, or waste usage for any campus building
          </p>
        </div>
        {justAdded && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource Type Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
            1. Resource Type *
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setResourceType('electricity')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                resourceType === 'electricity'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Electricity (kWh)</span>
            </button>

            <button
              type="button"
              onClick={() => setResourceType('water')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                resourceType === 'water'
                  ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Droplets className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Water (Litres)</span>
            </button>

            <button
              type="button"
              onClick={() => setResourceType('waste')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                resourceType === 'waste'
                  ? 'border-amber-600 bg-amber-50 text-amber-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Trash2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Solid Waste (kg)</span>
            </button>
          </div>
        </div>

        {/* Quantity, Date, Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              2. Quantity ({getUnit()}) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder="e.g. 145.2"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value)
                  if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }))
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all ${
                  errors.quantity ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              3. Date of Log *
            </label>
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
            {errors.date && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              4. Location / Classroom
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all bg-white text-slate-800"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="Custom...">Custom / Other Classroom...</option>
            </select>
          </div>
        </div>

        {location === 'Custom...' && (
          <div>
            <input
              type="text"
              placeholder="Enter custom classroom name, lab, or campus block..."
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            5. Observation Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. High usage due to evening robotics workshop or student orientation"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Campus Record</span>
          </button>
        </div>
      </form>
    </div>
  )
}
