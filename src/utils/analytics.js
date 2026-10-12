// Core analytics, formulas, anomaly detection, and period comparisons

/**
 * Computes aggregate resource totals from stored records.
 */
export const calculateTotals = (records = []) => {
  const totals = {
    electricity: 0,
    water: 0,
    waste: 0,
    count: records.length,
    userCount: 0,
    demoCount: 0,
  }

  records.forEach((rec) => {
    const qty = Number(rec.quantity) || 0
    if (rec.resourceType === 'electricity') totals.electricity += qty
    if (rec.resourceType === 'water') totals.water += qty
    if (rec.resourceType === 'waste') totals.waste += qty

    if (rec.source === 'user') totals.userCount += 1
    else totals.demoCount += 1
  })

  // Estimated Carbon Footprint (Indian Grid proxy & municipal pumping proxies)
  // Transparent approximation note: 0.82 kg CO2e/kWh, 0.0003 kg CO2e/L, 0.45 kg CO2e/kg waste
  const estimatedCarbonKg = (
    totals.electricity * 0.82 +
    totals.water * 0.0003 +
    totals.waste * 0.45
  )

  return {
    ...totals,
    estimatedCarbonKg: Math.round(estimatedCarbonKg * 10) / 10,
  }
}

/**
 * Compares current period (last 7 days of available data) with previous period (prior 7 days).
 * Calculates exact percentage change using actual stored records.
 */
export const calculatePeriodComparison = (records = [], daysWindow = 7) => {
  if (!records.length) {
    return {
      electricity: { current: 0, previous: 0, changePercent: 0, isReduction: true },
      water: { current: 0, previous: 0, changePercent: 0, isReduction: true },
      waste: { current: 0, previous: 0, changePercent: 0, isReduction: true },
      windowDays: daysWindow,
    }
  }

  // Sort dates
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latestDate = new Date(sorted[0].date)

  const currentWindowStart = new Date(latestDate)
  currentWindowStart.setDate(currentWindowStart.getDate() - (daysWindow - 1))
  currentWindowStart.setHours(0, 0, 0, 0)

  const prevWindowStart = new Date(currentWindowStart)
  prevWindowStart.setDate(prevWindowStart.getDate() - daysWindow)
  prevWindowStart.setHours(0, 0, 0, 0)

  const currentUsage = { electricity: 0, water: 0, waste: 0 }
  const prevUsage = { electricity: 0, water: 0, waste: 0 }

  records.forEach((rec) => {
    const recDate = new Date(rec.date)
    recDate.setHours(0, 0, 0, 0)
    const qty = Number(rec.quantity) || 0

    if (recDate >= currentWindowStart && recDate <= latestDate) {
      if (currentUsage[rec.resourceType] !== undefined) {
        currentUsage[rec.resourceType] += qty
      }
    } else if (recDate >= prevWindowStart && recDate < currentWindowStart) {
      if (prevUsage[rec.resourceType] !== undefined) {
        prevUsage[rec.resourceType] += qty
      }
    }
  })

  const calcDiff = (curr, prev) => {
    if (prev === 0 && curr === 0) return { changePercent: 0, isReduction: true, changeType: 'neutral' }
    if (prev === 0 && curr > 0) return { changePercent: 100, isReduction: false, changeType: 'surge' }
    
    // Percentage shift: ((Current - Previous) / Previous) * 100
    const rawDiff = ((curr - prev) / prev) * 100
    const rounded = Math.round(rawDiff * 10) / 10
    const isReduction = rounded <= 0

    return {
      changePercent: Math.abs(rounded),
      isReduction,
      changeType: rounded < 0 ? 'saving' : rounded > 0 ? 'surge' : 'neutral',
      rawChange: rounded,
    }
  }

  return {
    electricity: {
      current: Math.round(currentUsage.electricity * 10) / 10,
      previous: Math.round(prevUsage.electricity * 10) / 10,
      ...calcDiff(currentUsage.electricity, prevUsage.electricity),
    },
    water: {
      current: Math.round(currentUsage.water * 10) / 10,
      previous: Math.round(prevUsage.water * 10) / 10,
      ...calcDiff(currentUsage.water, prevUsage.water),
    },
    waste: {
      current: Math.round(currentUsage.waste * 10) / 10,
      previous: Math.round(prevUsage.waste * 10) / 10,
      ...calcDiff(currentUsage.waste, prevUsage.waste),
    },
    windowDays: daysWindow,
    latestDateStr: latestDate.toISOString().split('T')[0],
  }
}

/**
 * Savings Calculator Formula:
 * Savings (%) = ((Baseline Usage - Current Usage) / Baseline Usage) * 100
 * Handles zero values gracefully.
 * Clearly differentiates true savings (consumption decreased) from consumption surges (consumption increased).
 */
export const calculateSavingsMetric = (baseline, current) => {
  const b = Number(baseline)
  const c = Number(current)

  if (isNaN(b) || isNaN(c) || b <= 0) {
    return {
      savingsPercent: 0,
      absoluteDiff: 0,
      type: 'undefined',
      label: 'Please specify a baseline greater than zero',
      isSavings: false,
    }
  }

  const rawPercent = ((b - c) / b) * 100
  const roundedPercent = Math.round(rawPercent * 10) / 10
  const absoluteDiff = Math.round(Math.abs(b - c) * 10) / 10

  if (roundedPercent > 0) {
    return {
      savingsPercent: roundedPercent,
      absoluteDiff,
      type: 'saving',
      label: `${roundedPercent}% Reduction Achieved`,
      isSavings: true,
      description: `Current consumption is ${absoluteDiff} units below the established baseline.`,
    }
  } else if (roundedPercent < 0) {
    // Show increase in consumption as an increase / surge, NOT as savings!
    const surgePercent = Math.abs(roundedPercent)
    return {
      savingsPercent: surgePercent,
      absoluteDiff,
      type: 'increase',
      label: `${surgePercent}% Consumption Increase`,
      isSavings: false,
      description: `Current consumption exceeded the baseline by ${absoluteDiff} units (+${surgePercent}% surge).`,
    }
  } else {
    return {
      savingsPercent: 0,
      absoluteDiff: 0,
      type: 'equal',
      label: 'At Baseline (0% Change)',
      isSavings: false,
      description: 'Current consumption exactly matches the established baseline.',
    }
  }
}

/**
 * Anomaly Detection:
 * Flags records where consumption is >= 35% higher than the resource's mean average.
 */
export const detectAnomalies = (records = []) => {
  if (!records || records.length < 3) return []

  // Compute average per resource type
  const sums = { electricity: 0, water: 0, waste: 0 }
  const counts = { electricity: 0, water: 0, waste: 0 }

  records.forEach((r) => {
    const qty = Number(r.quantity) || 0
    if (sums[r.resourceType] !== undefined) {
      sums[r.resourceType] += qty
      counts[r.resourceType] += 1
    }
  })

  const averages = {
    electricity: counts.electricity ? sums.electricity / counts.electricity : 0,
    water: counts.water ? sums.water / counts.water : 0,
    waste: counts.waste ? sums.waste / counts.waste : 0,
  }

  const anomalies = []

  records.forEach((rec) => {
    const avg = averages[rec.resourceType]
    const qty = Number(rec.quantity) || 0
    if (avg > 0 && qty >= avg * 1.35) {
      const percentageAbove = Math.round(((qty - avg) / avg) * 100)
      anomalies.push({
        record: rec,
        average: Math.round(avg * 10) / 10,
        percentageAbove,
        severity: percentageAbove >= 60 ? 'high' : 'moderate',
        reason: `${percentageAbove}% higher than campus average (${Math.round(avg)} ${rec.resourceType === 'electricity' ? 'kWh' : rec.resourceType === 'water' ? 'L' : 'kg'})`,
      })
    }
  })

  return anomalies.sort((a, b) => b.percentageAbove - a.percentageAbove)
}

/**
 * Groups records into daily time series for Recharts.
 */
export const formatTimeSeriesData = (records = []) => {
  const dateMap = {}

  records.forEach((rec) => {
    if (!rec.date) return
    if (!dateMap[rec.date]) {
      dateMap[rec.date] = {
        date: rec.date,
        displayDate: rec.date.slice(5), // MM-DD
        electricity: 0,
        water: 0,
        waste: 0,
        recordCount: 0,
      }
    }
    const qty = Number(rec.quantity) || 0
    if (rec.resourceType === 'electricity') dateMap[rec.date].electricity += qty
    if (rec.resourceType === 'water') dateMap[rec.date].water += qty
    if (rec.resourceType === 'waste') dateMap[rec.date].waste += qty
    dateMap[rec.date].recordCount += 1
  })

  const sortedDates = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date))
  
  // Format numbers cleanly
  return sortedDates.map((item) => ({
    ...item,
    electricity: Math.round(item.electricity * 10) / 10,
    water: Math.round(item.water),
    waste: Math.round(item.waste * 10) / 10,
  }))
}

/**
 * Breakdown of consumption by campus zone / building.
 */
export const getZoneBreakdown = (records = [], resourceType = 'electricity') => {
  const zoneMap = {}

  records
    .filter((r) => !resourceType || r.resourceType === resourceType)
    .forEach((rec) => {
      const loc = rec.location || 'Unassigned Zone'
      if (!zoneMap[loc]) {
        zoneMap[loc] = 0
      }
      zoneMap[loc] += Number(rec.quantity) || 0
    })

  const result = Object.entries(zoneMap).map(([location, total]) => ({
    location,
    total: Math.round(total * 10) / 10,
  }))

  return result.sort((a, b) => b.total - a.total)
}

/**
 * Calculates a transparent Campus Green Performance Index (0 - 100)
 */
export const calculateCampusEcoScore = (records = [], baselines = { electricity: 140, water: 1600, waste: 45 }) => {
  if (!records.length) return { score: 70, tier: 'Moderate', color: 'text-amber-600', badge: 'Baseline Pending' }

  const comparison = calculatePeriodComparison(records, 7)
  let score = 75 // Neutral baseline

  // Electricity impact
  if (comparison.electricity.isReduction) {
    score += Math.min(12, comparison.electricity.changePercent * 0.8)
  } else {
    score -= Math.min(15, comparison.electricity.changePercent * 0.7)
  }

  // Water impact
  if (comparison.water.isReduction) {
    score += Math.min(10, comparison.water.changePercent * 0.6)
  } else {
    score -= Math.min(12, comparison.water.changePercent * 0.5)
  }

  // Waste impact
  if (comparison.waste.isReduction) {
    score += Math.min(8, comparison.waste.changePercent * 0.5)
  } else {
    score -= Math.min(10, comparison.waste.changePercent * 0.5)
  }

  // Constrain between 30 and 98
  const finalScore = Math.max(30, Math.min(98, Math.round(score)))

  let tier = 'Developing'
  let color = 'text-amber-600'
  let badge = 'Needs Attention'

  if (finalScore >= 85) {
    tier = 'Exemplary'
    color = 'text-emerald-600'
    badge = 'Campus Green Leader'
  } else if (finalScore >= 72) {
    tier = 'Commendable'
    color = 'text-teal-600'
    badge = 'Positive Reduction Trajectory'
  } else if (finalScore >= 60) {
    tier = 'Moderate'
    color = 'text-amber-600'
    badge = 'Optimization Recommended'
  } else {
    tier = 'High Footprint'
    color = 'text-rose-600'
    badge = 'Urgent Wastage Actions Needed'
  }

  return {
    score: finalScore,
    tier,
    color,
    badge,
  }
}
