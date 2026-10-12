import React from 'react'
import {
  Menu,
  PlusCircle,
  FileSpreadsheet,
  UploadCloud,
  Database,
  HelpCircle,
  LogOut,
  GraduationCap,
  ShieldCheck,
  User,
} from 'lucide-react'

export function Topbar({
  activeTab,
  onOpenSidebar,
  onOpenAddModal,
  onOpenImportModal,
  onOpenExplainer,
  onLoadDemo,
  onExportCSV,
  recordCount,
  currentUser,
  onLogout,
}) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Campus Overview',
          subtitle: 'See total electricity, water, waste and overall green score at a glance',
        }
      case 'tracker':
        return {
          title: 'Usage Tracker',
          subtitle: 'Add daily electricity, water, and waste logs or import a CSV file',
        }
      case 'charts':
        return {
          title: 'Charts & Trends',
          subtitle: 'Visual graphs of daily consumption and building-by-building comparisons',
        }
      case 'insights':
        return {
          title: 'Weekly Insights & Alerts',
          subtitle: 'Compare usage with last week and quickly spot unusually high usage',
        }
      case 'calculator':
        return {
          title: 'Savings Calculator',
          subtitle: 'Compare actual usage against target goals to see your savings percentage',
        }
      default:
        return { title: 'GreenPulse Dashboard', subtitle: 'Campus sustainability tracker' }
    }
  }

  const { title, subtitle } = getTabTitle(activeTab)

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Profile Badge & Logout */}
        {currentUser && (
          <div className="flex items-center gap-2 pr-1 sm:pr-2 border-r border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                currentUser.role === 'student' ? 'bg-emerald-600' : currentUser.role === 'faculty' ? 'bg-sky-700' : 'bg-slate-700'
              }`}>
                {currentUser.avatar || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {currentUser.role === 'student' ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                      <GraduationCap className="w-2.5 h-2.5" />
                      <span>Student</span>
                    </span>
                  ) : currentUser.role === 'faculty' ? (
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-100/70 px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Faculty</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">
                      Guest
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out / Switch User"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={onOpenExplainer}
          className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex items-center gap-1.5"
          title="Methodology Standards"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="hidden md:inline">Calculations</span>
        </button>

        {onOpenImportModal && (
          <button
            onClick={onOpenImportModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 shadow-xs transition-all"
            title="Import records from CSV file"
          >
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            <span>Import</span>
          </button>
        )}

        {recordCount > 0 ? (
          <button
            onClick={onExportCSV}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all"
            title="Download CSV log"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export</span>
          </button>
        ) : (
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-all"
          >
            <Database className="w-4 h-4" />
            <span>Demo</span>
          </button>
        )}

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden xs:inline">Add Record</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>
    </header>
  )
}
