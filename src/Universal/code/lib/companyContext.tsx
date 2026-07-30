import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Company = {
  id: string
  name: string
  registration_number: string
  industry: string
}

type CompanyContextType = {
  companies: Company[]
  activeCompany: Company | null
  setActiveCompany: (company: Company | null) => void
  addCompany: (company: Company) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('nexyra_companies')
    return saved ? JSON.parse(saved) : []
  })
  
  const [activeCompany, setActiveCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem('nexyra_active_company')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('nexyra_companies', JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem('nexyra_active_company', JSON.stringify(activeCompany))
  }, [activeCompany])

  const addCompany = (company: Company) => {
    setCompanies((prev) => [...prev, company])
    if (!activeCompany) {
      setActiveCompany(company)
    }
  }

  return (
    <CompanyContext.Provider value={{ companies, activeCompany, setActiveCompany, addCompany }}>
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompany = () => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}
