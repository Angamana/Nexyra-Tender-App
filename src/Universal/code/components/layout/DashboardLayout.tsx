import { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Building2, FileText, Settings, LayoutDashboard, PlusCircle, Database, ChevronDown, Check, Menu, X } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { useCompany } from '../../lib/companyContext'
import { cn } from '../../lib/utils'

export default function DashboardLayout() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { activeCompany, companies, setActiveCompany } = useCompany()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Memory Bank', href: '/attributes', icon: Database },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-100 justify-between">
        <div className="flex items-center gap-3">
          <img src="./logo.png" alt="NEXYRA Logo" className="h-8 w-8 object-contain" />
          <h1 className="text-xl font-bold tracking-wide">
            <span className="text-gray-900">NEXYRA</span><span className="text-gray-500 text-sm font-medium ml-1">Tenders</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <Link to="/tenders/new" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors shadow-md shadow-blue-600/20">
          <PlusCircle className="w-4 h-4" />
          New Tender
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-[#f8fafc] text-gray-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 border-r border-gray-200 flex-col bg-white shadow-sm z-20 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col md:hidden transition-transform duration-300 ease-in-out transform",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 bg-gray-50 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-full border border-gray-200 shadow-sm cursor-pointer transition-colors max-w-[220px] sm:max-w-xs md:max-w-md"
              >
                <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-500 hidden md:block">Memory Bank:</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">{activeCompany?.name || 'Select a Company'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Premium Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Companies</p>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {companies.length === 0 && (
                        <p className="px-3 py-2 text-sm text-gray-500">No companies found.</p>
                      )}
                      {companies.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveCompany(c)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeCompany?.id === c.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          <span className="truncate">{c.name}</span>
                          {activeCompany?.id === c.id && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 p-2 bg-gray-50">
                    <Link 
                      to="/companies/new" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add New Company
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div 
              onClick={signOut}
              title="Sign out"
              className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:border-blue-600 transition-colors cursor-pointer shadow-sm flex-shrink-0"
            >
              <span className="text-sm font-bold text-gray-700">{user?.initial || 'U'}</span>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
