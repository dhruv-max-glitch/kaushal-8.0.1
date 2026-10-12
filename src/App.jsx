import React, { useState } from 'react'
import { useGreenPulseData } from './hooks/useGreenPulseData'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { HackathonBanner } from './components/layout/HackathonBanner'
import { Toast } from './components/common/Toast'
import { QuickActionModal } from './components/dashboard/QuickActionModal'
import { CalculationExplainer } from './components/insights/CalculationExplainer'
import { LoginPage } from './components/auth/LoginPage'
import { ImportCSVModal } from './components/tracker/ImportCSVModal'

// Tab views
import { DashboardOverview } from './components/dashboard/DashboardOverview'
import { TrackerView } from './components/tracker/TrackerView'
import { ConsumptionChartsView } from './components/charts/ConsumptionChartsView'
import { SustainabilityInsightsView } from './components/insights/SustainabilityInsightsView'
import { SavingsCalculatorView } from './components/calculator/SavingsCalculatorView'

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isExplainerOpen, setIsExplainerOpen] = useState(false)

  const {
    currentUser,
    login,
    logout,
    records,
    baselines,
    toast,
    setToast,
    addRecord,
    deleteRecord,
    loadDemoData,
    clearAllData,
    updateBaseline,
    exportCSV,
    importRecords,
  } = useGreenPulseData()

  // If user is not logged in, render the Student/Faculty Login & Sign Up Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8faf9] font-sans">
        <LoginPage onLogin={login} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      {/* Top University Sustainability Banner */}
      <HackathonBanner onOpenExplainer={() => setIsExplainerOpen(true)} />

      <div className="flex-1 flex">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLoadDemo={loadDemoData}
          onClearData={clearAllData}
          onExportCSV={exportCSV}
          onOpenImportCSV={() => setIsImportModalOpen(true)}
          totalRecords={records.length}
          currentUser={currentUser}
          onLogout={logout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Top Navigation Bar */}
          <Topbar
            activeTab={activeTab}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenExplainer={() => setIsExplainerOpen(true)}
            onLoadDemo={loadDemoData}
            onExportCSV={exportCSV}
            recordCount={records.length}
            currentUser={currentUser}
            onLogout={logout}
          />

          {/* Active Tab View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
            {activeTab === 'dashboard' && (
              <DashboardOverview
                records={records}
                onNavigate={setActiveTab}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onLoadDemo={loadDemoData}
              />
            )}

            {activeTab === 'tracker' && (
              <TrackerView
                records={records}
                onAddRecord={addRecord}
                onDeleteRecord={deleteRecord}
                onExportCSV={exportCSV}
                onOpenImportCSV={() => setIsImportModalOpen(true)}
                onLoadDemo={loadDemoData}
              />
            )}

            {activeTab === 'charts' && (
              <ConsumptionChartsView
                records={records}
                baselines={baselines}
                onLoadDemo={loadDemoData}
                onAddRecord={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === 'insights' && (
              <SustainabilityInsightsView
                records={records}
                onOpenExplainer={() => setIsExplainerOpen(true)}
                onNavigate={setActiveTab}
                onLoadDemo={loadDemoData}
                onAddRecord={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === 'calculator' && (
              <SavingsCalculatorView
                records={records}
                baselines={baselines}
                onUpdateBaseline={updateBaseline}
                onOpenExplainer={() => setIsExplainerOpen(true)}
              />
            )}

          </main>

          {/* Clean University Footer */}
          <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-6 text-xs text-slate-500 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
            <div>
              <strong className="text-slate-800 font-semibold">GreenPulse</strong> — Smart Campus Sustainability Dashboard
              <span className="text-slate-400 mx-2">•</span>
              <span>SVVV Indore</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Department of Environmental Sciences & Campus Facilities Management
            </div>
          </footer>
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <QuickActionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRecord={addRecord}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportRecords={importRecords}
      />

      <CalculationExplainer
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

export default App
