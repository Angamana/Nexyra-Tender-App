import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTenders } from '../../Universal/code/lib/tenderContext'
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import TenderTracker from './TenderTracker'

export default function TenderDetail() {
  const { id } = useParams<{ id: string }>()
  const { tenders, updateTender } = useTenders()
  const tender = tenders.find(t => t.id === id)
  const [activeTab, setActiveTab] = useState('Executive Summary')
  const TABS = ['Executive Summary', 'Compliance Checklist', 'Pricing Schedule', 'Methodology']

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h2 className="text-xl font-bold text-gray-900">Tender Not Found</h2>
        <Link to="/" className="text-blue-600 font-medium hover:underline">Return to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Link 
            to="/" 
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex-shrink-0 mt-0.5"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug break-words">
              {tender.title}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-100">
                {tender.refNumber}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">• {tender.companyName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 flex-wrap sm:flex-nowrap">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {tender.status === 'In Progress' ? 'Auto-saved just now' : `Status: ${tender.status}`}
          </span>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
            {tender.status === 'In Progress' ? (
              <>
                <button 
                  onClick={() => updateTender(tender.id, { status: 'Submitted', submissionDate: new Date().toISOString(), validityDays: 90 })}
                  className="flex-1 sm:flex-none text-xs sm:text-sm font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg transition-colors shadow-xs text-center"
                >
                  Mark as Submitted
                </button>
                <button className="flex-1 sm:flex-none text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>AI Compile</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => updateTender(tender.id, { status: 'In Progress' })}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                Revert to Compiling
              </button>
            )}
          </div>
        </div>
      </div>

      {tender.status === 'In Progress' ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] md:h-[calc(100vh-220px)]">
          {/* Editor Sidebar / Mobile Tabs Header */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 p-3 md:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible flex-shrink-0">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 hidden md:block">Tender Sections</div>
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm font-bold md:bg-blue-50 md:text-blue-700 md:border md:border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Editor Main Content Area */}
          {activeTab === 'Executive Summary' && (
            <div className="flex-1 p-4 sm:p-8 bg-white overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-4">Executive Summary</h3>
                <div className="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
                  <p className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md inline-block text-xs uppercase tracking-wider">
                    AI Generated Draft
                  </p>
                  <p>
                    This proposal outlines our comprehensive approach to delivering a Cloud Based Integrated Medical Management Solution as requested in <span className="font-semibold text-gray-900">{tender.refNumber}</span>. Our solution leverages state-of-the-art cloud architecture to ensure 99.9% uptime, strict compliance with POPIA regulations, and seamless integration with existing legacy systems.
                  </p>
                  <p>
                    With over 15 years of experience delivering robust management platforms to the public sector, we are uniquely positioned to minimize implementation risk while accelerating time-to-value for your organization.
                  </p>
                </div>
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-900 leading-normal">
                  <strong className="font-bold text-amber-950">AI Note:</strong> Please review the section highlighting integration with legacy systems, as the RFP was ambiguous on the specific legacy database engine currently in use.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Compliance Checklist' && (
            <div className="flex-1 p-4 sm:p-8 bg-white overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-4">Compliance Requirements</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">The AI has scanned the tender document and extracted the following mandatory returnable documents.</p>
                
                <div className="space-y-3">
                  {[
                    { name: 'Valid Tax Clearance Certificate', status: 'ready', note: 'Found in Memory Bank' },
                    { name: 'B-BBEE Sworn Affidavit / Certificate', status: 'ready', note: 'Found in Memory Bank (Valid until Dec 2026)' },
                    { name: 'CSD Registration Summary Report', status: 'missing', note: 'Not found in Memory Bank. Please upload.' },
                    { name: 'Completed SBD 4 Form (Declaration of Interest)', status: 'action', note: 'AI has drafted this. Requires manual signature.' },
                    { name: 'Proof of Professional Indemnity Insurance', status: 'ready', note: 'Found in Memory Bank' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50 gap-2">
                      <div className="flex items-center gap-3">
                        {item.status === 'ready' ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : 
                         item.status === 'missing' ? <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> :
                         <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                        <span className="font-semibold text-xs sm:text-sm text-gray-800">{item.name}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start sm:self-auto ${
                        item.status === 'ready' ? 'bg-green-100 text-green-700' :
                        item.status === 'missing' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Pricing Schedule' && (
            <div className="flex-1 p-4 sm:p-8 bg-white overflow-y-auto">
              <div className="max-w-4xl mx-auto text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-4 mb-4">Pricing Schedule</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">AI has structured your standard pricing into the format requested by Annexure B of the RFP.</p>
                
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-xs">
                  <table className="w-full text-xs sm:text-sm text-left min-w-[500px]">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3">Resource / Deliverable</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Rate (ZAR)</th>
                        <th className="px-4 py-3">Total Excl. VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-white">
                        <td className="px-4 py-3.5 font-medium">Cloud Infrastructure Setup</td>
                        <td className="px-4 py-3.5">Month 1</td>
                        <td className="px-4 py-3.5">R 150,000.00</td>
                        <td className="px-4 py-3.5 font-semibold">R 150,000.00</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-4 py-3.5 font-medium">System Integration & Customization</td>
                        <td className="px-4 py-3.5">Months 2-3</td>
                        <td className="px-4 py-3.5">R 200,000.00 / mo</td>
                        <td className="px-4 py-3.5 font-semibold">R 400,000.00</td>
                      </tr>
                      <tr className="border-b bg-white">
                        <td className="px-4 py-3.5 font-medium">Annual Licensing & Support</td>
                        <td className="px-4 py-3.5">12 Months</td>
                        <td className="px-4 py-3.5">R 45,000.00 / mo</td>
                        <td className="px-4 py-3.5 font-semibold">R 540,000.00</td>
                      </tr>
                      <tr className="bg-gray-50 font-bold border-t-2 border-gray-200">
                        <td colSpan={3} className="px-4 py-4 text-right">Total Bid Price (Excl. VAT):</td>
                        <td className="px-4 py-4 text-blue-700 font-extrabold text-sm sm:text-base">R 1,090,000.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Methodology' && (
            <div className="flex-1 p-4 sm:p-8 bg-white overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 border-b pb-4">Implementation Methodology</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-xs">
                    <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1.5">Phase 1: Project Initiation & Scoping (Weeks 1-2)</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-normal">The AI pulled this phase from your standard "Agile Software Implementation" methodology stored in the Memory Bank. It has been tailored to specifically mention the stakeholders from this RFP.</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-xs">
                    <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-1.5">Phase 2: Cloud Architecture & Deployment (Weeks 3-5)</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-normal">This section utilizes your standard AWS GovCloud deployment templates, ensuring compliance with South African data sovereignty requirements as stipulated in the RFP.</p>
                  </div>
                  <div className="p-4 border border-blue-200 bg-blue-50/60 rounded-lg shadow-xs">
                    <h4 className="font-bold text-sm sm:text-base text-blue-900 mb-1.5">Phase 3: Legacy System Data Migration (Weeks 6-8)</h4>
                    <p className="text-xs sm:text-sm text-blue-800 leading-normal"><strong className="text-blue-950">AI Generated Custom Section:</strong> Since this RFP specifically requires legacy migration from existing medical systems, the AI generated a custom methodology for ETL (Extract, Transform, Load) processes tailored to healthcare records.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <TenderTracker tender={tender} />
      )}
    </div>
  )
}
