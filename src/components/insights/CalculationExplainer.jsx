import React from 'react'
import { X, ShieldAlert, CheckCircle2, Calculator, Info, Cpu, Sparkles } from 'lucide-react'

export function CalculationExplainer({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-elevated border border-slate-200/90 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Calculation Methodology & Boundary Disclaimers
              </h3>
              <p className="text-xs text-slate-500">
                Campus Environmental Resource Standards & Methodology
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* Methodological Context */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-950 mb-1">
                Data Integration & Metric Reliability
              </h4>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                GreenPulse aggregates observational consumption entries across campus academic wings, computer labs, student hostels, and dining facilities.
                All percentage shifts, anomaly flags, and savings calculations adhere to standardized environmental accounting formulas.
              </p>
            </div>
          </div>

          {/* Formulas breakdown */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Mathematical Formulas
            </h4>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>1. Savings / Variance Formula</span>
                <span className="text-xs text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Savings (%)
                </span>
              </div>
              <div className="font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                Savings (%) = ((Baseline Usage - Current Usage) / Baseline Usage) × 100
              </div>
              <ul className="text-xs text-slate-500 list-disc list-inside space-y-1 pt-1">
                <li>If Baseline &le; 0: Handled safely as undefined/zero baseline.</li>
                <li>If Current &gt; Baseline: Formatted as a <strong>Surge (+)</strong>, never labeled as savings.</li>
                <li>If Current &lt; Baseline: Formatted as a true conservation saving.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>2. Period-over-Period Percentage Shift</span>
                <span className="text-xs text-slate-600 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  Rolling 7-Day Window
                </span>
              </div>
              <div className="font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                Change (%) = ((Recent 7 Days Sum - Previous 7 Days Sum) / Previous 7 Days Sum) × 100
              </div>
              <p className="text-xs text-slate-500">
                Computed strictly from stored date timestamps. Allows colleges to see if recent awareness initiatives produced measurable reductions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>3. Anomaly Detection Threshold</span>
                <span className="text-xs text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Spike Trigger
                </span>
              </div>
              <div className="font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                Anomaly Trigger: Record Quantity &ge; 1.35 × (Mean Consumption of Resource)
              </div>
              <p className="text-xs text-slate-500">
                Flags abnormal consumption events (e.g. overnight air conditioner left on, plumbing valve leaks, unmanaged cafeteria wastage).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>4. Carbon Proxy Factors (Indian CEA Standard Proxies)</span>
                <span className="text-xs text-sky-700 font-mono bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  CO₂e Estimation
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li>• <strong>Electricity:</strong> 0.82 kg CO₂e / kWh (Central Electricity Authority grid emission baseline proxy).</li>
                <li>• <strong>Water:</strong> 0.0003 kg CO₂e / Litre (Pumping and municipal treatment energy proxy).</li>
                <li>• <strong>Solid Waste:</strong> 0.45 kg CO₂e / kg (Landfill anaerobic decomposition proxy).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  )
}
