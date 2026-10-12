// Format numbers, dates, and units cleanly

export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: Number.isInteger(num) ? 0 : Math.min(decimals, 1),
  }).format(num)
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

export const getResourceMeta = (type) => {
  switch (type) {
    case 'electricity':
      return {
        id: 'electricity',
        name: 'Electricity',
        unit: 'kWh',
        accentColor: '#059669', // Emerald 600
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        badgeBg: 'bg-emerald-100/70',
        iconName: 'Zap',
        co2Factor: 0.82, // kg CO2e per kWh (standard India grid proxy)
        costFactor: 8.5, // Approx ₹8.5/unit commercial tariff proxy
      }
    case 'water':
      return {
        id: 'water',
        name: 'Water',
        unit: 'Litres',
        accentColor: '#0284c7', // Sky 600
        lightBg: 'bg-sky-50',
        textColor: 'text-sky-700',
        borderColor: 'border-sky-200',
        badgeBg: 'bg-sky-100/70',
        iconName: 'Droplets',
        co2Factor: 0.0003, // kg CO2e per litre (water treatment & municipal pumping proxy)
        costFactor: 0.04, // Approx ₹0.04/L campus tankering & pumping
      }
    case 'waste':
      return {
        id: 'waste',
        name: 'Solid Waste',
        unit: 'kg',
        accentColor: '#d97706', // Amber 600
        lightBg: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        badgeBg: 'bg-amber-100/70',
        iconName: 'Trash2',
        co2Factor: 0.45, // kg CO2e per kg unmanaged municipal landfill proxy
        costFactor: 2.0, // Processing & recycling haulage proxy
      }
    default:
      return {
        id: type,
        name: type,
        unit: 'units',
        accentColor: '#64748b',
        lightBg: 'bg-slate-50',
        textColor: 'text-slate-700',
        borderColor: 'border-slate-200',
        badgeBg: 'bg-slate-100',
        iconName: 'Activity',
        co2Factor: 0,
        costFactor: 0,
      }
  }
}
