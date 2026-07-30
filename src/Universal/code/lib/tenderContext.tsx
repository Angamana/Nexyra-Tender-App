import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type TenderStatus = 'In Progress' | 'Submitted' | 'Won' | 'Lost'

export type RequiredDocument = {
  id: string
  name: string
  status: 'missing' | 'uploaded'
  requiresHumanIntervention: boolean
  interventionReason?: string
  fileUrl?: string
}

export type TrackerLog = {
  id: string
  date: string
  note: string
  author: string
}

export type Tender = {
  id: string
  companyId: string
  companyName: string
  title: string
  refNumber: string
  closingDate: string
  status: TenderStatus
  score: number
  lastSavedAt: string
  submissionDate?: string
  validityDays?: number
  requiredDocuments?: RequiredDocument[]
  trackerLogs?: TrackerLog[]
}

interface TenderContextType {
  tenders: Tender[]
  addTender: (tender: Omit<Tender, 'id' | 'lastSavedAt'>) => void
  updateTender: (id: string, updates: Partial<Tender>) => void
  deleteTender: (id: string) => void
}

const TenderContext = createContext<TenderContextType | undefined>(undefined)

export function TenderProvider({ children }: { children: ReactNode }) {
  const [tenders, setTenders] = useState<Tender[]>(() => {
    const saved = localStorage.getItem('nexyra_tenders')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('nexyra_tenders', JSON.stringify(tenders))
  }, [tenders])

  const addTender = (tender: Omit<Tender, 'id' | 'lastSavedAt'>) => {
    const newTender: Tender = {
      ...tender,
      id: crypto.randomUUID(),
      lastSavedAt: new Date().toISOString()
    }
    setTenders(prev => [newTender, ...prev])
  }

  const updateTender = (id: string, updates: Partial<Tender>) => {
    setTenders(prev => prev.map(t => t.id === id ? { ...t, ...updates, lastSavedAt: new Date().toISOString() } : t))
  }

  const deleteTender = (id: string) => {
    setTenders(prev => prev.filter(t => t.id !== id))
  }

  return (
    <TenderContext.Provider value={{ tenders, addTender, updateTender, deleteTender }}>
      {children}
    </TenderContext.Provider>
  )
}

export function useTenders() {
  const context = useContext(TenderContext)
  if (context === undefined) {
    throw new Error('useTenders must be used within a TenderProvider')
  }
  return context
}
