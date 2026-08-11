import { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { CompanyProvider } from './lib/companyContext'
import { TenderProvider } from './lib/tenderContext'
import { SettingsProvider } from './lib/settingsContext'
import DashboardLayout from './components/layout/DashboardLayout'
import AuthLayout from './components/layout/AuthLayout'
import CompanyList from '../../Companies/code/CompanyList'
import CompanyForm from '../../Companies/code/CompanyForm'
import CompanyAttributes from '../../Companies/code/CompanyAttributes'
import NewTender from '../../Tenders/code/NewTender'
import TenderDetail from '../../Tenders/code/TenderDetail'
import TemplateList from '../../Templates/code/TemplateList'
import SettingsPage from '../../Settings/code/SettingsPage'
import Login from '../../Auth/code/Login'
import Dashboard from '../../Dashboard/code/Dashboard'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return (
    <AuthProvider>
      <SettingsProvider>
        <CompanyProvider>
          <TenderProvider>
            <Router>
          <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="companies/new" element={<CompanyForm />} />
            <Route path="attributes" element={<CompanyAttributes />} />
            <Route path="tenders/new" element={<NewTender />} />
            <Route path="tenders/:id" element={<TenderDetail />} />
            <Route path="templates" element={<TemplateList />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        </Router>
        </TenderProvider>
      </CompanyProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
