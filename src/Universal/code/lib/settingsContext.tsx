import { createContext, useContext, useState, type ReactNode } from 'react'

type ProfileSettings = {
  fullName: string
  phoneNumber: string
}

type APISettings = {
  aiProvider: string
  aiKey: string
  twilioSid: string
  twilioToken: string
}

type NotificationSettings = {
  channels: ('whatsapp' | 'email' | 'calendar')[]
  briefingReminders: number[] // e.g. [3, 2, 1] hours before
  physicalWazeReminders: number[] // e.g. [2, 1] hours before
  missingDocsTimes: string[] // e.g. ['09:00', '12:00']
  webScraperFallback: boolean
}

type LegalSettings = {
  region: string
  frameworks: string[]
  strictMode: boolean
}

type SettingsContextType = {
  profile: ProfileSettings
  setProfile: React.Dispatch<React.SetStateAction<ProfileSettings>>
  apiKeys: APISettings
  setApiKeys: React.Dispatch<React.SetStateAction<APISettings>>
  notifications: NotificationSettings
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>
  legal: LegalSettings
  setLegal: React.Dispatch<React.SetStateAction<LegalSettings>>
  saveSettings: () => void
}

const defaultProfile: ProfileSettings = { fullName: 'Anga', phoneNumber: '+27' }
const defaultApi: APISettings = { aiProvider: 'Anthropic (Claude 3.5 Sonnet)', aiKey: '', twilioSid: '', twilioToken: '' }
const defaultNotifs: NotificationSettings = { 
  channels: ['whatsapp', 'email'], 
  briefingReminders: [3, 2, 1], 
  physicalWazeReminders: [2, 1], 
  missingDocsTimes: ['09:00', '12:00'],
  webScraperFallback: true
}
const defaultLegal: LegalSettings = {
  region: 'South Africa',
  frameworks: ['PPPFA', 'National Treasury', 'General African Procurement Laws'],
  strictMode: true
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileSettings>(() => {
    const saved = localStorage.getItem('nexyra_settings_profile')
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
  })

  const [apiKeys, setApiKeys] = useState<APISettings>(() => {
    const saved = localStorage.getItem('nexyra_settings_api')
    return saved ? { ...defaultApi, ...JSON.parse(saved) } : defaultApi
  })

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('nexyra_settings_notifications')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Check if it's the old schema
      if (!parsed.channels) {
        return defaultNotifs
      }
      return { ...defaultNotifs, ...parsed }
    }
    return defaultNotifs
  })

  const [legal, setLegal] = useState<LegalSettings>(() => {
    const saved = localStorage.getItem('nexyra_settings_legal')
    return saved ? { ...defaultLegal, ...JSON.parse(saved) } : defaultLegal
  })

  const saveSettings = () => {
    localStorage.setItem('nexyra_settings_profile', JSON.stringify(profile))
    localStorage.setItem('nexyra_settings_api', JSON.stringify(apiKeys))
    localStorage.setItem('nexyra_settings_notifications', JSON.stringify(notifications))
    localStorage.setItem('nexyra_settings_legal', JSON.stringify(legal))
  }

  // Auto-save on change is also an option, but we have a manual save button.
  // We'll stick to the manual save function provided.

  return (
    <SettingsContext.Provider value={{ profile, setProfile, apiKeys, setApiKeys, notifications, setNotifications, legal, setLegal, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
