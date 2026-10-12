// Client-side CSV Exporter utility for campus resource logs

export const exportRecordsToCSV = (records = []) => {
  if (!records || records.length === 0) {
    alert("No records available to export.")
    return false
  }

  const headers = [
    "Record ID",
    "Date",
    "Resource Type",
    "Quantity",
    "Unit",
    "Location / Classroom",
    "Notes",
    "Data Source",
    "Created At",
  ]

  const getUnit = (type) => {
    switch (type) {
      case 'electricity': return 'kWh'
      case 'water': return 'Litres'
      case 'waste': return 'kg'
      default: return 'units'
    }
  }

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '""'
    const str = String(field).replace(/"/g, '""')
    return `"${str}"`
  }

  const rows = records.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.date),
    escapeCSV(r.resourceType),
    escapeCSV(r.quantity),
    escapeCSV(getUnit(r.resourceType)),
    escapeCSV(r.location || 'Unassigned'),
    escapeCSV(r.notes || ''),
    escapeCSV(r.source === 'user' ? 'User-Entered' : 'Simulated Demo'),
    escapeCSV(new Date(r.createdAt || Date.now()).toISOString()),
  ])

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((row) => row.join(','))].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  link.setAttribute('href', url)
  link.setAttribute('download', `GreenPulse_Campus_Records_${dateStr}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}
