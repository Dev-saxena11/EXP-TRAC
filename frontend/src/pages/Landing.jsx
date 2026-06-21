import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Wallet, 
  ChevronDown, 
  Check, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Layout, 
  Eye, 
  FileSpreadsheet 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { theme, setTheme, accentColor, setAccentColor, background, setBackground } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const getThemeGradient = () => {
    switch (accentColor) {
      case 'blue':
        return 'from-blue-400 to-indigo-500';
      case 'purple':
        return 'from-purple-400 to-pink-500';
      case 'orange':
        return 'from-orange-400 to-rose-500';
      case 'teal':
      default:
        return 'from-teal-400 to-cyan-500';
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-primary-500" />,
      title: "Real-time Analytics",
      description: "Get immediate insights into your spending and income with dynamic, interactive charts that help you make better decisions."
    },
    {
      icon: <Wallet className="h-6 w-6 text-primary-500" />,
      title: "Category Breakdown",
      description: "Log transactions and automatically divide them into customized expense categories to identify saving opportunities."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary-500" />,
      title: "Sleek Customization",
      description: "Switch seamlessly between multiple custom themes and fluid, organic background animations to match your personal vibe."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary-500" />,
      title: "Secure Firebase Auth",
      description: "Your financial records are secure. Log in with email verification, persistent local storage, or temporary sessions."
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-primary-500" />,
      title: "Export to Excel",
      description: "Need to do tax reviews or deeper analysis? Generate and download spreadsheet statements of your records instantly."
    },
    {
      icon: <Layout className="h-6 w-6 text-primary-500" />,
      title: "Responsive Interface",
      description: "A gorgeous, responsive mobile-friendly dashboard that fits perfectly on smartphones, tablets, and desktop monitors."
    }
  ];

  const faqs = [
    {
      q: "What is EXP-TRAC?",
      a: "EXP-TRAC is a premium personal finance tracking and analytics dashboard. It allows you to monitor your earnings and expenses, visualize categorizations, and customize the visual design to suit your preferences."
    },
    {
      q: "Is my financial data secure?",
      a: "Absolutely. EXP-TRAC integrates Firebase Authentication and stores your information securely. We do not sell or share your data with third parties."
    },
    {
      q: "Can I try out the color accent themes?",
      a: "Yes! You can toggle them in the customization panel right on this page, or inside the application via the Theme Settings panel."
    },
    {
      q: "How can I export my statements?",
      a: "Inside both the Income and Expense pages, there is an Export button that downloads your entire transaction log in standard Microsoft Excel (.xlsx) format."
    }
  ];

  return (
    <div className="min-h-screen text-foreground transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0 opacity-30">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary-500/30 to-indigo-500/20 blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/30 blur-[100px] animate-pulse duration-[6s]" />
      </div>

      {/* Header/Navbar */}
      <nav className="sticky top-0 z-40 bg-background/70 backdrop-blur-md border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-lg">ET</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              EXP-<span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">TRAC</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#features" className="text-gray-500 hover:text-foreground transition-colors">Features</a>
            <a href="#customize" className="text-gray-500 hover:text-foreground transition-colors">Customize</a>
            <a href="#faq" className="text-gray-500 hover:text-foreground transition-colors">FAQ</a>
          </div>

          {/* Auth Button CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl font-bold bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:shadow-primary-600/30 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-500 hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2.5 rounded-xl font-bold text-gray-500 hover:text-foreground hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl font-bold bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:shadow-primary-600/30 transition-all cursor-pointer"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:text-foreground hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background transition-colors duration-300 px-6 py-6 space-y-4"
            >
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-500 hover:text-foreground"
              >
                Features
              </a>
              <a 
                href="#customize" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-500 hover:text-foreground"
              >
                Customize
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-500 hover:text-foreground"
              >
                FAQ
              </a>
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                {user ? (
                  <>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                      className="w-full py-3 rounded-xl font-bold bg-primary-500 text-white text-center shadow-lg"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                      className="w-full py-3 rounded-xl font-bold border border-border text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl font-bold border border-border text-center"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl font-bold bg-primary-500 text-white text-center shadow-lg"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 md:py-24 flex flex-col lg:flex-row gap-16 items-center z-10">
        
        {/* Left Side Info */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Upgrade your wealth engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Take Control of Your Wealth With{" "}
            <span className={`bg-gradient-to-r ${getThemeGradient()} bg-clip-text text-transparent`}>
              Infinite Clarity
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            A premium personal expense analytics dashboard engineered to trace your financials with modern styling, fluid animated backgrounds, and full interactive control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-lg bg-primary-500 text-white shadow-xl shadow-primary-500/25 hover:bg-primary-600 hover:shadow-primary-600/35 transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <Link 
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-lg bg-primary-500 text-white shadow-xl shadow-primary-500/25 hover:bg-primary-600 hover:shadow-primary-600/35 transition-all text-center"
                >
                  Get Started For Free
                </Link>
                <Link 
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-lg border border-border bg-surface/40 hover:bg-white/5 hover:border-foreground/20 transition-all text-center"
                >
                  Live Demo
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border max-w-md mx-auto lg:mx-0 text-left">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">10k+</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">$4.8M+</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">Tracked</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">99.9%</p>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">Uptime</p>
            </div>
          </div>
        </div>

        {/* Right Side Video Mockup */}
        <div className="flex-1 w-full max-w-2xl relative">
          
          {/* Decorative Backglow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-indigo-500/25 rounded-[2.5rem] blur-[30px] -z-10 scale-95" />

          {/* Premium Device Mockup Frame */}
          <div className="bg-surface rounded-3xl p-3 shadow-2xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 mb-3 px-3">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
              <div className="w-full flex justify-center text-xs font-medium text-gray-500 truncate select-none pl-4">
                http://localhost:5173/dashboard
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border relative bg-[#09070f] aspect-[16/10]">
              <video 
                src="/vid/can_we_have_an_animation_.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                poster="/vid/Gemini_Generated_Image_5gqytf5gqytf5gqy.png"
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-border scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-sm font-extrabold tracking-widest text-primary-500 uppercase">Core Features</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Designed for Speed, Customised for You
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive financial command center packed with visual aids, data formatting, and flexible visual customizers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-foreground/10 transition-all duration-300 space-y-5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground">{feat.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Customization Section */}
      <section id="customize" className="max-w-7xl mx-auto px-6 py-24 border-t border-border scroll-mt-20">
        <div className="bg-surface rounded-[2rem] border border-border p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Dynamic BG elements in container */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-indigo-500/5 -z-10 pointer-events-none" />

          {/* Left panel control */}
          <div className="flex-1 space-y-6">
            <span className="text-sm font-extrabold text-primary-500 uppercase tracking-widest">Interactive Engine</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Test Drive the Theme System In Real Time
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Experience the core responsive style system that governs EXP-TRAC. Use the buttons below to toggle dark mode, swap core accent colors, or toggle fluid animated background waves.
            </p>

            {/* Config Control Grid */}
            <div className="space-y-6 pt-4 border-t border-border">
              
              {/* Dark mode */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Appearance</span>
                <div className="flex gap-3 max-w-xs">
                  {['light', 'dark'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-2 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        theme === t
                          ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                          : 'border-border bg-background hover:bg-white/5 text-gray-500 hover:text-foreground'
                      }`}
                    >
                      {t === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      <span className="capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Accent Colors</span>
                <div className="grid grid-cols-4 gap-2.5 max-w-sm">
                  {[
                    { id: 'teal', color: 'bg-[#14b8a6]' },
                    { id: 'blue', color: 'bg-[#3b82f6]' },
                    { id: 'purple', color: 'bg-[#a855f7]' },
                    { id: 'orange', color: 'bg-[#f97316]' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAccentColor(c.id)}
                      className={`py-2.5 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        accentColor === c.id
                          ? 'border-primary-500 bg-primary-500/10 text-primary-500 shadow-sm'
                          : 'border-border bg-background hover:bg-white/5 text-gray-500'
                      }`}
                    >
                      <div className={`h-4.5 w-4.5 rounded-full ${c.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider select-none">{c.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Animations */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Backdrop Glow Pattern</span>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'none', label: 'Solid Color' },
                    { id: 'waves', label: 'Ambient Glows' },
                    { id: 'fluid', label: 'Fluid Wave' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBackground(bg.id)}
                      className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        background === bg.id
                          ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                          : 'border-border bg-background hover:bg-white/5 text-gray-500'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right panel mock representation */}
          <div className="flex-1 w-full max-w-md relative flex justify-center">
            
            {/* Ambient Backlight that reacts to theme accent */}
            <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-primary-500/25 to-indigo-500/25 blur-[50px] -z-10" />

            <div className="w-full bg-background rounded-2xl p-5 border border-border shadow-xl">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 font-bold text-sm">ET</div>
                  <div>
                    <h4 className="text-xs font-extrabold">Active Accent: <span className="capitalize text-primary-500">{accentColor}</span></h4>
                    <p className="text-[10px] text-gray-500 font-medium">Rendered Theme State</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full border border-primary-500/10 bg-primary-500/5 text-primary-500 font-bold text-[10px] uppercase select-none">
                  {theme} Mode
                </div>
              </div>

              {/* Sample Mini Progress Stats */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Monthly Savings Goal</span>
                    <span className="text-primary-500">76%</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: '76%' }} />
                  </div>
                </div>
                
                {/* Dummy stats cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-border bg-surface/50">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Net Income</span>
                    <p className="text-sm font-extrabold text-foreground mt-1">$4,820.00</p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface/50">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Expenses</span>
                    <p className="text-sm font-extrabold text-foreground mt-1 text-orange-500">$1,540.00</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-primary-500/10 bg-primary-500/5 flex items-center justify-between">
                  <span className="text-xs font-semibold">Animation Speed</span>
                  <span className="text-xs font-extrabold text-primary-500">{background === 'none' ? 'Disabled' : 'Dynamic Flow'}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 border-t border-border scroll-mt-20">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-extrabold tracking-widest text-primary-500 uppercase">Have Questions?</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-border rounded-2xl bg-surface/40 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-foreground hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border"
                  >
                    <p className="px-6 py-5 text-gray-600 text-sm leading-relaxed bg-background/50">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="max-w-7xl mx-auto px-6 py-12 mb-16">
        <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[2rem] p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to Master Your Finances?</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Create your account today and gain immediate, high-fidelity insights into your income and expenses with premium customization options.
          </p>
          <div className="pt-4">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 rounded-xl font-extrabold text-lg bg-white text-primary-600 hover:bg-white/90 shadow-xl transition-all inline-flex items-center gap-3 group cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link 
                to="/signup"
                className="px-8 py-4 rounded-xl font-extrabold text-lg bg-white text-primary-600 hover:bg-white/90 shadow-xl transition-all inline-block"
              >
                Get Started for Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm">ET</div>
            <span className="font-bold text-base tracking-tight text-gray-500">
              © {new Date().getFullYear()} EXP-TRAC. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#customize" className="hover:text-foreground">Customize</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <a href="/login" className="hover:text-foreground">Sign In</a>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
