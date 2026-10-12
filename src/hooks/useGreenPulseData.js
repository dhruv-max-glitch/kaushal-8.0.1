import { useState, useEffect, useCallback } from 'react'
import { generateDemoRecords } from '../data/demoRecords'
import { exportRecordsToCSV } from '../utils/csvExporter'

const STORAGE_KEY = 'greenpulse_campus_records_v1'
const BASELINE_KEY = 'greenpulse_campus_baselines_v1'
const USER_KEY = 'greenpulse_campus_user_v1'

const DEFAULT_BASELINES = {
  electricity: 140, // kWh daily baseline
  water: 1600,      // Litres daily baseline
  waste: 45,        // kg daily baseline
}

export function useGreenPulseData() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY) || localStorage.getItem('ecotrack_campus_user_v1')
      if (savedUser) {
        return JSON.parse(savedUser)
      }
    } catch (e) {
      console.error('Error loading user from localStorage:', e)
    }
    return null
  })

  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('ecotrack_campus_records_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Error loading records from localStorage:', e)
    }
    // Default to realistic demo records on initial launch
    return generateDemoRecords()
  })

  const [baselines, setBaselines] = useState(() => {
    try {
      const saved = localStorage.getItem(BASELINE_KEY) || localStorage.getItem('ecotrack_campus_baselines_v1')
      if (saved) {
        return { ...DEFAULT_BASELINES, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Error loading baselines:', e)
    }
    return DEFAULT_BASELINES
  })

  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type })
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 4000)
  }, [])

  // Sync user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
      } else {
        localStorage.removeItem(USER_KEY)
      }
    } catch (e) {
      console.error('Failed to sync user to localStorage:', e)
    }
  }, [currentUser])

  // Sync records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch (e) {
      console.error('Failed to save records to localStorage:', e)
    }
  }, [records])

  // Sync baselines to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BASELINE_KEY, JSON.stringify(baselines))
    } catch (e) {
      console.error('Failed to save baselines to localStorage:', e)
    }
  }, [baselines])

  const login = useCallback((user) => {
    setCurrentUser(user)
    showToast(`Welcome, ${user.name}! Signed in as ${user.roleLabel || user.role}.`, 'success')
  }, [showToast])

  const logout = useCallback(() => {
    setCurrentUser(null)
    showToast('You have been signed out.', 'info')
  }, [showToast])

  const addRecord = useCallback((newRecord) => {
    const record = {
      id: `usr-rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: newRecord.date,
      resourceType: newRecord.resourceType,
      quantity: parseFloat(newRecord.quantity),
      location: (newRecord.location || '').trim() || 'General Campus',
      notes: (newRecord.notes || '').trim(),
      source: 'user', // Marked as user data!
      loggedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Anonymous Campus User',
      createdAt: Date.now(),
    }

    setRecords((prev) => [record, ...prev])
    showToast(`New ${newRecord.resourceType} record (${newRecord.quantity}) successfully logged!`, 'success')
    return record
  }, [currentUser, showToast])

  const deleteRecord = useCallback((id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
    showToast('Record deleted successfully.', 'info')
  }, [showToast])

  const loadDemoData = useCallback(() => {
    const demo = generateDemoRecords()
    setRecords(demo)
    showToast('Demo dataset loaded with 30 multi-day campus records!', 'success')
  }, [showToast])

  const clearAllData = useCallback(() => {
    setRecords([])
    showToast('All records cleared. Dataset is currently empty.', 'info')
  }, [showToast])

  const updateBaseline = useCallback((type, value) => {
    const val = parseFloat(value)
    if (!isNaN(val) && val >= 0) {
      setBaselines((prev) => ({ ...prev, [type]: val }))
      showToast(`Updated baseline for ${type} to ${val}.`, 'success')
    }
  }, [showToast])

  const exportCSV = useCallback(() => {
    const success = exportRecordsToCSV(records)
    if (success) {
      showToast('Exported records to CSV successfully.', 'success')
    }
  }, [records, showToast])

  const importRecords = useCallback((newRecords) => {
    if (!Array.isArray(newRecords) || newRecords.length === 0) return
    setRecords((prev) => [...newRecords, ...prev])
    showToast(`Successfully imported ${newRecords.length} records from CSV!`, 'success')
  }, [showToast])

  return {
    currentUser,
    login,
    logout,
    records,
    baselines,
    toast,
    setToast,
    showToast,
    addRecord,
    deleteRecord,
    loadDemoData,
    clearAllData,
    updateBaseline,
    exportCSV,
    importRecords,
  }
}
