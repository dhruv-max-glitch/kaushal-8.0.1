import React from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Sparkles,
  Calculator,
  Leaf,
  Database,
  RotateCcw,
  FileSpreadsheet,
  UploadCloud,
  X,
  LogOut,
  GraduationCap,
  ShieldCheck,
  User,
} from 'lucide-react'

export function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onLoadDemo,
  onClearData,
  onExportCSV,
  onOpenImportCSV,
  totalRecords,
  currentUser,
  onLogout,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Usage Tracker', icon: ClipboardList, badge: totalRecords },
    { id: 'charts', label: 'Charts & Trends', icon: BarChart3 },
    { id: 'insights', label: 'Weekly Insights', icon: Sparkles },
    { id: 'calculator', label: 'Savings Calculator', icon: Calculator },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  GreenPulse
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Smart Sustainability Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card if Logged In */}
        {currentUser && (
          <div className="px-3 pt-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    currentUser.role === 'student'
                      ? 'bg-emerald-600'
                      : currentUser.role === 'faculty'
                      ? 'bg-sky-700'
                      : 'bg-slate-700'
                  }`}
                >
                  {currentUser.avatar || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700 truncate">
                    {currentUser.role === 'student' ? 'Student Portal' : currentUser.role === 'faculty' ? 'Faculty Portal' : 'Guest Portal'}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                title="Switch User / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  onClose?.()
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-emerald-200/70 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Demo Data & Quick Action Controls in Sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2">
          <div className="px-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Data Controls
          </div>
          <button
            onClick={onLoadDemo}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/70 rounded-xl transition-all border border-emerald-200/60"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Load Demo Dataset (30 logs)</span>
          </button>
          
          {onOpenImportCSV && (
            <button
              onClick={onOpenImportCSV}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200/60 shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import CSV Records</span>
            </button>
          )}

          <button
            onClick={onExportCSV}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV Records</span>
          </button>

          <button
            onClick={onClearData}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset / Clear All Records</span>
          </button>

          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              localStorage Engine • Offline Ready
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
