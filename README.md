# 🌿 GreenPulse — Smart Campus Sustainability Dashboard
### SVVV Indore • Campus Sustainability & Environmental Resource Management

---

## 🌟 Overview
**GreenPulse** is a functional, responsive, data-driven web platform designed to help universities and colleges track, understand, and reduce:
- **Electricity Consumption (kWh)** across computer labs, lecture halls, and administrative wings.
- **Water Consumption (Litres)** across dining messes, hostels, and campus washrooms.
- **Solid Waste Generation (kg)** with source segregation and organic composting diversion.

---

## 🚀 Live Access
- **Local URL:** `http://localhost:5173/`
- **Network / LAN URL:** `http://<lan-ip>:5173/` (accessible from phones or tablets on the same campus Wi-Fi)
- **Data Persistence:** Browser `localStorage` (records, baselines, and user profiles persist automatically across reloads)
- **Zero Paid Dependencies:** Runs completely client-side without paid APIs or cloud keys.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 18 + Vite (rapid HMR and optimized asset bundling)
- **Styling:** Tailwind CSS (customized forest-green palette `#064e3b`, `#059669`, clean white cards, subtle shadows)
- **Interactive Visualizations:** Recharts (Area curves, Horizontal building breakdowns, Grouped baseline comparisons, Carbon proxy donut charts)
- **Iconography:** Lucide React
- **Data Import & Export:** Built-in client-side RFC 4180 CSV parser and generator
- **State Management:** Custom reactive React hook with `localStorage` persistence

---

## 📋 Key Features

### 1. Dual Portal Sign In & Sign Up
- **Student Portal:**
  - Login with student email or enrollment roll number.
  - New Student Registration with department and roll number.
  - Log classroom observation entries and review campus sustainability progress.
- **Faculty & Coordinator Portal:**
  - Login with faculty email or employee ID.
  - New Faculty Registration with designation and administrative wing.
  - Manage campus baseline targets, audit building logs, and export official CSV reports.
- **1-Click Demo Login:** Pre-filled accounts for fast previewing without typing passwords.
- **Guest Access:** Direct entry for visitors and evaluators.

### 2. CSV Data Import & Export
- **Import CSV:** Drag & drop any `.csv` log file or utility spreadsheet with instant parsing and data row preview.
- **Downloadable Template:** One-click download of `GreenPulse_Campus_Template.csv` with standard column headers:
  `Date, Resource Type, Quantity, Location / Classroom, Notes`.
- **Export CSV:** Instant RFC-compliant CSV generation formatted for campus reporting.

### 3. Sustainability Dashboard & Real-Time KPIs
- Real-time KPI cards for Electricity, Water, Solid Waste, and Carbon Footprint ($kg\text{ CO}_2$).
- Dynamic **Campus Green Score** ($0 - 100$) with tier classifications.
- Recent 10-day consumption trend area curve with tooltips.

### 4. Resource Tracker & Data Logging
- Validated form for logging observations with date picker, resource type, numeric quantity, location selector, and notes.
- Filter by resource, search by classroom/notes, sort by date or quantity, and delete records.

### 5. Interactive Analytics & Charts
- Multi-resource area curves with 7-day, 14-day, and full-history filters.
- Campus building horizontal bar charts.
- Actual vs. baseline target daily grouped bar charts.
- Emissions proxy distribution donut chart.

### 6. Period-over-Period Insights & Anomaly Detection
- Rolling 7-day period comparison against prior 7-day window.
- Automatic anomaly detection flagging records that exceed $\ge 35\%$ above historical resource averages.

### 7. Target Savings & Surge Calculator
- Interactive formula:
  $$\text{Savings } (\%) = \left(\frac{\text{Baseline} - \text{Current}}{\text{Baseline}}\right) \times 100$$
- Accurately classifies consumption exceeding target as a **Surge (+%)**.
- Editable baseline caps per resource.

---

## 🏃 Running the Application
```bash
# 1. Open project directory
cd ecotrack-campus

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173/
```
