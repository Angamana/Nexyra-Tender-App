import { useState } from 'react'
import { User, Key, Bell, Shield, Globe, MessageSquare, Save, CheckCircle2, Scale, Clock, Activity, FileText } from 'lucide-react'
import { useSettings } from '../../Universal/code/lib/settingsContext'

type Tab = 'profile' | 'api' | 'notifications' | 'legal' | 'security'

export default function SettingsPage() {
  const { profile, setProfile, apiKeys, setApiKeys, notifications, setNotifications, legal, setLegal, saveSettings } = useSettings()
  const [activeTab, setActiveTab] = useState<Tab>('api')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    saveSettings()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your personal preferences and system-wide integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`} />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'api' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Key className={`w-5 h-5 ${activeTab === 'api' ? 'text-blue-600' : 'text-gray-400'}`} />
              API Integrations
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-400'}`} />
              Alerts & Reminders
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'legal' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Scale className={`w-5 h-5 ${activeTab === 'legal' ? 'text-blue-600' : 'text-gray-400'}`} />
              Legal Frameworks
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Shield className={`w-5 h-5 ${activeTab === 'security' ? 'text-blue-600' : 'text-gray-400'}`} />
              Security
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Profile Information</h2>
              <div className="max-w-md space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.fullName} 
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (For WhatsApp / Waze)</label>
                  <input 
                    type="tel" 
                    value={profile.phoneNumber} 
                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                    placeholder="+27 82 123 4567"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Include country code. This number will receive AI dispatches.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" defaultValue="anga@thenexyra.com" disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" defaultValue="Administrator" disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">API Keys & Integrations</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure endpoints for the AI Engine and Notification Services.</p>
                </div>
              </div>
              
              <div className="space-y-8 max-w-2xl">
                {/* AI Engine */}
                <div className="p-5 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">AI Brain (Anthropic Claude / OpenAI)</h3>
                      <p className="text-xs text-gray-500">Powers the document parser and compiler workspace.</p>
                    </div>
                  </div>
                  <div className="space-y-4 pl-13">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Provider</label>
                      <select 
                        value={apiKeys.aiProvider}
                        onChange={(e) => setApiKeys({ ...apiKeys, aiProvider: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      >
                        <option>Anthropic (Claude 3.5 Sonnet)</option>
                        <option>OpenAI (GPT-4o)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">API Key</label>
                      <input 
                        type="password" 
                        placeholder="sk-ant-api03-..." 
                        value={apiKeys.aiKey}
                        onChange={(e) => setApiKeys({ ...apiKeys, aiKey: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="p-5 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">WhatsApp Notification Service</h3>
                      <p className="text-xs text-gray-500">Sends briefing links, waze routes, and deadline alerts.</p>
                    </div>
                  </div>
                  <div className="space-y-4 pl-13">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Twilio Account SID</label>
                      <input 
                        type="text" 
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx" 
                        value={apiKeys.twilioSid}
                        onChange={(e) => setApiKeys({ ...apiKeys, twilioSid: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Twilio Auth Token</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••••••••••••••" 
                        value={apiKeys.twilioToken}
                        onChange={(e) => setApiKeys({ ...apiKeys, twilioToken: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Alert Preferences</h2>
              <div className="space-y-6 max-w-2xl">
                
                {/* Delivery Channels */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Delivery Channels</h3>
                  <div className="flex gap-4">
                    {['whatsapp', 'email', 'calendar'].map(channel => (
                      <label key={channel} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.channels.includes(channel as any)}
                          onChange={(e) => {
                            const newChannels = e.target.checked 
                              ? [...notifications.channels, channel]
                              : notifications.channels.filter(c => c !== channel)
                            setNotifications({ ...notifications, channels: newChannels as any })
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Briefing Reminders */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">Compulsory Briefing Alerts</h3>
                      <p className="text-xs text-gray-500">Includes Teams/Zoom links auto-extracted from tender docs.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pl-8">
                    {[3, 2, 1].map(hours => (
                      <label key={`briefing-${hours}`} className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 border border-gray-200 rounded-md shadow-sm">
                        <input 
                          type="checkbox" 
                          checked={notifications.briefingReminders.includes(hours)}
                          onChange={(e) => {
                            const newReminders = e.target.checked 
                              ? [...notifications.briefingReminders, hours]
                              : notifications.briefingReminders.filter(h => h !== hours)
                            setNotifications({ ...notifications, briefingReminders: newReminders })
                          }}
                          className="w-3.5 h-3.5 text-blue-600 rounded" 
                        />
                        <span className="text-xs font-medium">{hours}hr prior</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Physical Submission Waze Routing */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">Physical Submission (Waze Routing)</h3>
                      <p className="text-xs text-gray-500">Only sent for tenders requiring physical delivery.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pl-8">
                    {[2, 1].map(hours => (
                      <label key={`waze-${hours}`} className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 border border-gray-200 rounded-md shadow-sm">
                        <input 
                          type="checkbox" 
                          checked={notifications.physicalWazeReminders.includes(hours)}
                          onChange={(e) => {
                            const newReminders = e.target.checked 
                              ? [...notifications.physicalWazeReminders, hours]
                              : notifications.physicalWazeReminders.filter(h => h !== hours)
                            setNotifications({ ...notifications, physicalWazeReminders: newReminders })
                          }}
                          className="w-3.5 h-3.5 text-blue-600 rounded" 
                        />
                        <span className="text-xs font-medium">{hours}hr prior</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Missing Docs Digest */}
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">Missing Mandatory Documents Digest</h3>
                      <p className="text-xs text-gray-500">Daily summaries of required documents pending human action.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pl-8">
                    {['09:00', '12:00'].map(time => (
                      <label key={`doc-${time}`} className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 border border-gray-200 rounded-md shadow-sm">
                        <input 
                          type="checkbox" 
                          checked={notifications.missingDocsTimes.includes(time)}
                          onChange={(e) => {
                            const newTimes = e.target.checked 
                              ? [...notifications.missingDocsTimes, time]
                              : notifications.missingDocsTimes.filter(t => t !== time)
                            setNotifications({ ...notifications, missingDocsTimes: newTimes })
                          }}
                          className="w-3.5 h-3.5 text-blue-600 rounded" 
                        />
                        <span className="text-xs font-medium">Daily @ {time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Web Scraper Fallback Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Fallback: Manual Extension Polling
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">If the AI cannot scrape the eTender portal due to CAPTCHAs, send reminders 2 days & 1 day before deadline.</p>
                  </div>
                  <div 
                    onClick={() => setNotifications({ ...notifications, webScraperFallback: !notifications.webScraperFallback })}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${notifications.webScraperFallback ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${notifications.webScraperFallback ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Legal & Compliance Engines</h2>
              <div className="space-y-6 max-w-2xl">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Procurement Region</label>
                  <p className="text-xs text-gray-500 mb-3">The AI will apply local tender laws and regulatory standards for this region.</p>
                  <select 
                    value={legal.region}
                    onChange={(e) => setLegal({ ...legal, region: e.target.value })}
                    className="w-full md:w-1/2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium"
                  >
                    <option>South Africa</option>
                    <option>Nigeria</option>
                    <option>Kenya</option>
                    <option>General African Procurements</option>
                  </select>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Active Legislative Frameworks</label>
                  <p className="text-xs text-gray-500 mb-4">Select the specific acts the AI must cross-reference when compiling and parsing documents.</p>
                  
                  <div className="space-y-3">
                    {['PPPFA (Preferential Procurement)', 'National Treasury Regulations', 'B-BBEE Codes of Good Practice', 'CIDB Construction Grading'].map(framework => (
                      <label key={framework} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={legal.frameworks.includes(framework)}
                          onChange={(e) => {
                            const newFrameworks = e.target.checked 
                              ? [...legal.frameworks, framework]
                              : legal.frameworks.filter(f => f !== framework)
                            setLegal({ ...legal, frameworks: newFrameworks })
                          }}
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                        <div>
                          <span className="text-sm font-bold text-gray-900">{framework}</span>
                          <p className="text-xs text-gray-500">Ensure strict compliance with {framework} during document AI compilation.</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg mt-6">
                  <div>
                    <h3 className="font-bold text-sm text-red-900 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Strict Mode
                    </h3>
                    <p className="text-xs text-red-700 mt-1">If enabled, the AI will heavily penalize templates and references that lack exact figures, durations, and mandatory clauses.</p>
                  </div>
                  <div 
                    onClick={() => setLegal({ ...legal, strictMode: !legal.strictMode })}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shrink-0 ${legal.strictMode ? 'bg-red-600' : 'bg-red-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${legal.strictMode ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Security Settings</h2>
              <div className="max-w-md space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="Password" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="Password" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" placeholder="Confirm Password" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Common Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
