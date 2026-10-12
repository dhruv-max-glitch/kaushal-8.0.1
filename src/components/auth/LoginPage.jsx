import React, { useState } from 'react'
import {
  Leaf,
  GraduationCap,
  ShieldCheck,
  Zap,
  Droplets,
  Trash2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building,
  CheckCircle2,
  Sparkles,
  UserPlus,
  LogIn,
} from 'lucide-react'

export const DEMO_USERS = {
  student: {
    id: 'std_01',
    name: 'Aryan Sharma',
    email: 'aryan.cs@svvv.edu.in',
    idNumber: '0827CS231045',
    role: 'student',
    roleLabel: 'Student Eco-Ambassador',
    department: 'Computer Science & Engineering',
    avatar: 'AS',
  },
  faculty: {
    id: 'fac_01',
    name: 'Dr. Ritu Verma',
    email: 'dr.ritu@svvv.edu.in',
    idNumber: 'FAC-ENV-204',
    role: 'faculty',
    roleLabel: 'Faculty Sustainability Coordinator',
    department: 'Dept. of Environmental Sciences & Facilities',
    avatar: 'RV',
  },
}

export function LoginPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [role, setRole] = useState('student') // 'student' | 'faculty'

  // Login form state
  const [email, setEmail] = useState('aryan.cs@svvv.edu.in')
  const [password, setPassword] = useState('ecoStudent2026')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Signup form state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupId, setSignupId] = useState('')
  const [signupDept, setSignupDept] = useState('Computer Science & Engineering')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')

  const [error, setError] = useState('')

  const handleRoleSwitch = (newRole) => {
    setRole(newRole)
    setError('')
    if (authMode === 'login') {
      if (newRole === 'student') {
        setEmail(DEMO_USERS.student.email)
        setPassword('ecoStudent2026')
      } else {
        setEmail(DEMO_USERS.faculty.email)
        setPassword('facultyGreenAdmin')
      }
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your campus email or ID')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    const baseUser = DEMO_USERS[role]
    onLogin({
      ...baseUser,
      email: email.trim(),
      rememberMe,
    })
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    if (!signupName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!signupEmail.trim()) {
      setError('Please enter your campus email')
      return
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    const initials = signupName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const newUser = {
      id: `usr_${Date.now()}`,
      name: signupName.trim(),
      email: signupEmail.trim(),
      idNumber: signupId.trim() || (role === 'student' ? 'STD-2026' : 'FAC-2026'),
      role,
      roleLabel: role === 'student' ? 'Student Eco-Ambassador' : 'Faculty Sustainability Coordinator',
      department: signupDept.trim(),
      avatar: initials || 'EC',
      rememberMe: true,
    }

    onLogin(newUser)
  }

  const handleQuickDemoLogin = (selectedRole) => {
    const user = DEMO_USERS[selectedRole]
    onLogin({
      ...user,
      rememberMe: true,
    })
  }

  const handleGuestLogin = () => {
    onLogin({
      id: 'guest_01',
      name: 'Campus Visitor',
      email: 'visitor@svvv.edu.in',
      idNumber: 'VIS-2026',
      role: 'guest',
      roleLabel: 'Campus Community Member',
      department: 'University Campus',
      avatar: 'CV',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf9] via-emerald-50/40 to-slate-100 flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-forest-950 text-white py-2.5 px-4 sm:px-8 text-xs flex items-center justify-between border-b border-emerald-800/40">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded text-[10px] tracking-wider border border-emerald-400/30">
              Campus Sustainability Portal
            </span>
            <span className="text-emerald-100 font-semibold hidden sm:inline">
              SVVV Indore • Environmental Management Network
            </span>
          </div>

          <button
            onClick={handleGuestLogin}
            className="text-emerald-200 hover:text-white font-semibold underline underline-offset-2 text-xs transition-colors"
          >
            Direct Guest Access →
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white border border-emerald-950/10 rounded-3xl shadow-elevated overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
          
          {/* Left Hero / Information Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-forest-900 to-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
              <Leaf className="w-64 h-64 text-emerald-300" />
            </div>

            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/30">
                  <Leaf className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xl tracking-tight text-white">
                      GreenPulse
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950">
                      Campus
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/90 font-medium">
                    Smart Campus Sustainability Dashboard
                  </p>
                </div>
              </div>

              {/* Tagline & Mission */}
              <div className="space-y-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 text-[11px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>College Sustainability Portal</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Understand, Measure & Reduce Campus Wastage
                </h2>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Join our campus-wide initiative to track electricity consumption, eliminate water leakage, and divert organic dining mess waste into green campus compost.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-emerald-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Electricity Tracking</strong>
                    <span className="text-emerald-300/80 text-[11px]">Daily kWh logs & lab sleep policies</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-emerald-100">
                  <div className="w-7 h-7 rounded-lg bg-sky-900/80 border border-sky-600/40 flex items-center justify-center text-sky-300 shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Water Conservation</strong>
                    <span className="text-emerald-300/80 text-[11px]">Flow audits, tank overflow cutoffs</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-emerald-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-900/80 border border-amber-600/40 flex items-center justify-center text-amber-300 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Solid Waste Reduction</strong>
                    <span className="text-emerald-300/80 text-[11px]">Mess food waste & source segregation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-emerald-800/60 text-[11px] text-emerald-300/80 flex items-center justify-between">
              <span>GreenPulse University Portal</span>
              <span className="font-mono bg-emerald-800/60 px-2 py-0.5 rounded text-[10px]">
                Active Network
              </span>
            </div>
          </div>

          {/* Right Form Panel (Sign In & Sign Up) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Sign In vs Sign Up Tab Switcher */}
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login')
                      setError('')
                    }}
                    className={`text-sm font-bold pb-2 relative transition-colors ${
                      authMode === 'login'
                        ? 'text-emerald-700 border-b-2 border-emerald-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup')
                      setError('')
                    }}
                    className={`text-sm font-bold pb-2 relative transition-colors ${
                      authMode === 'signup'
                        ? 'text-emerald-700 border-b-2 border-emerald-600'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Create Account (Sign Up)
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  {authMode === 'login' ? 'Existing Member' : 'New Registration'}
                </span>
              </div>

              {/* Role Selection Tabs */}
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Select Role:
                </span>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('student')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      role === 'student'
                        ? 'bg-white text-emerald-700 shadow-sm border border-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>Student Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('faculty')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      role === 'faculty'
                        ? 'bg-white text-emerald-700 shadow-sm border border-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Faculty & Coordinator</span>
                  </button>
                </div>
              </div>

              {/* One-Click Quick Login Box (Only in Login Mode) */}
              {authMode === 'login' && (
                <div className="p-3 mb-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>
                        Demo User: {DEMO_USERS[role].name}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-800">
                      {DEMO_USERS[role].department}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(role)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all whitespace-nowrap"
                  >
                    <span>1-Click Sign In</span>
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Login Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      {role === 'student' ? 'Campus Email or Roll Number' : 'Institutional Email ID'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={role === 'student' ? 'e.g. 0827CS231045 or aryan@svvv.edu.in' : 'e.g. dr.ritu@svvv.edu.in'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                        Forgot?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                      />
                      <span>Remember login session</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">
                      Saved in browser
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 group mt-2"
                  >
                    <span>Sign In as {role === 'student' ? 'Student' : 'Faculty'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              ) : (
                /* Registration / Sign Up Form */
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. Sneha Patel"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                        {role === 'student' ? 'Roll / Enrollment No *' : 'Employee ID *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={signupId}
                        onChange={(e) => setSignupId(e.target.value)}
                        placeholder={role === 'student' ? 'e.g. 0827CS241088' : 'e.g. FAC-CSE-102'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Campus Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="e.g. sneha.patel@svvv.edu.in"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Department / Campus Wing
                    </label>
                    <select
                      value={signupDept}
                      onChange={(e) => setSignupDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                      <option value="Mechanical & Civil Engineering">Mechanical & Civil Engineering</option>
                      <option value="Environmental Science & Facilities">Environmental Science & Facilities</option>
                      <option value="Hostels & Student Residences">Hostels & Student Residences</option>
                      <option value="Administration & Central Library">Administration & Central Library</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                        Password (Min 6 char) *
                      </label>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 group mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register as {role === 'student' ? 'Student' : 'Faculty'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Guest Entry Link */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Want to explore first?
              </span>
              <button
                type="button"
                onClick={handleGuestLogin}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
              >
                <span>Enter as Campus Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/60">
        GreenPulse • Smart Campus Sustainability Dashboard • SVVV Indore
      </footer>
    </div>
  )
}
