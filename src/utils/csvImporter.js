// Client-side CSV Importer utility with header matching and normalization

export const parseCSV = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('CSV content is empty')
  }

  const lines = csvText
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row')
  }

  // Parse header and split by comma while respecting quotes
  const parseCSVLine = (text) => {
    const result = []
    let cur = ''
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === '"' || char === "'") {
        if (inQuotes && text[i + 1] === char) {
          cur += char
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim())
        cur = ''
      } else {
        cur += char
      }
    }
    result.push(cur.trim())
    return result
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))
  
  // Find column indices
  const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('time') || h.includes('day'))
  const resourceIdx = headers.findIndex((h) => h.includes('resource') || h.includes('type') || h.includes('metric'))
  const qtyIdx = headers.findIndex((h) => h.includes('quant') || h.includes('val') || h.includes('amount') || h.includes('kwh') || h.includes('liter') || h.includes('kg'))
  const locationIdx = headers.findIndex((h) => h.includes('loc') || h.includes('class') || h.includes('room') || h.includes('block') || h.includes('build'))
  const notesIdx = headers.findIndex((h) => h.includes('note') || h.includes('desc') || h.includes('remark') || h.includes('comment'))

  if (qtyIdx === -1) {
    throw new Error('Could not identify a "Quantity" column in the uploaded CSV.')
  }

  const normalizeResourceType = (val = '') => {
    const clean = String(val).toLowerCase().trim()
    if (clean.includes('elec') || clean.includes('power') || clean.includes('energy') || clean.includes('kwh')) return 'electricity'
    if (clean.includes('water') || clean.includes('lit') || clean.includes('aqua')) return 'water'
    if (clean.includes('waste') || clean.includes('trash') || clean.includes('scrap') || clean.includes('kg')) return 'waste'
    return 'electricity'
  }

  const importedRecords = []

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i])
    if (!row || row.length === 0 || row.every((c) => !c)) continue

    const rawQty = row[qtyIdx]
    const qty = parseFloat(rawQty ? rawQty.replace(/[^0-9.-]/g, '') : '0')
    if (isNaN(qty) || qty <= 0) continue

    const rawDate = dateIdx !== -1 && row[dateIdx] ? row[dateIdx].trim() : ''
    let validDate = new Date().toISOString().split('T')[0]
    if (rawDate) {
      const parsed = new Date(rawDate)
      if (!isNaN(parsed.getTime())) {
        validDate = parsed.toISOString().split('T')[0]
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        validDate = rawDate
      }
    }

    const rawResource = resourceIdx !== -1 ? row[resourceIdx] : 'electricity'
    const resourceType = normalizeResourceType(rawResource)
    const location = locationIdx !== -1 && row[locationIdx] ? row[locationIdx].trim() : 'Imported Campus Zone'
    const notes = notesIdx !== -1 && row[notesIdx] ? row[notesIdx].trim() : 'Imported via CSV file'

    importedRecords.push({
      id: `imp-rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: validDate,
      resourceType,
      quantity: Math.round(qty * 10) / 10,
      location,
      notes,
      source: 'user',
      createdAt: Date.now(),
    })
  }

  if (importedRecords.length === 0) {
    throw new Error('No valid resource records could be extracted from the CSV.')
  }

  return importedRecords
}

export const downloadCSVTemplate = () => {
  const templateHeaders = [
    'Date',
    'Resource Type',
    'Quantity',
    'Location / Classroom',
    'Notes',
  ]

  const sampleRows = [
    ['2026-10-12', 'electricity', '124.5', 'Aryabhata Block - Lab 102', 'Practical lab sessions'],
    ['2026-10-12', 'water', '1450', 'Student Cafeteria & Mess', 'Dining kitchen usage'],
    ['2026-10-12', 'waste', '36.0', 'Hostel Block C - Boys', 'Dry paper & food packaging'],
  ]

  const csvContent = [
    templateHeaders.map((h) => `"${h}"`).join(','),
    ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(',')),
  ].join('\r\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'GreenPulse_Campus_Template.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
