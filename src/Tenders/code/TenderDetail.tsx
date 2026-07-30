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
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h2 className="text-xl font-bold text-gray-900">Tender Not Found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{tender.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{tender.refNumber} • {tender.companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {tender.status === 'In Progress' ? 'Auto-saved just now' : `Status: ${tender.status}`}
          </span>
          {tender.status === 'In Progress' ? (
            <>
              <button 
                onClick={() => updateTender(tender.id, { status: 'Submitted', submissionDate: new Date().toISOString(), validityDays: 90 })}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-md font-medium transition-colors shadow-sm"
              >
                Mark as Submitted
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors shadow-sm">
                <Sparkles className="w-4 h-4" />
                AI Compile Document
              </button>
            </>
          ) : (
             <button 
                onClick={() => updateTender(tender.id, { status: 'In Progress' })}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Revert to Compiling
              </button>
          )}
        </div>
      </div>

      {tender.status === 'In Progress' ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Editor Sidebar */}
        <div className="w-64 border-r border-gray-100 bg-gray-50 p-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tender Sections</div>
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Editor Main */}
        {activeTab === 'Executive Summary' && (
          <div className="flex-1 p-8 bg-white overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">Executive Summary</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>[AI Generated Draft]</strong><br/><br/>
                This proposal outlines our comprehensive approach to delivering a Cloud Based Integrated Medical Management Solution as requested in {tender.refNumber}. Our solution leverages state-of-the-art cloud architecture to ensure 99.9% uptime, strict compliance with POPIA regulations, and seamless integration with existing legacy systems.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With over 15 years of experience delivering robust management platforms to the public sector, we are uniquely positioned to minimize implementation risk while accelerating time-to-value for your organization.
              </p>
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <strong>AI Note:</strong> Please review the section highlighting integration with legacy systems, as the RFP was ambiguous on the specific legacy database engine currently in use.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Compliance Checklist' && (
          <div className="flex-1 p-8 bg-white overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">Compliance Requirements</h3>
              <p className="text-sm text-gray-500 mb-6">The AI has scanned the tender document and extracted the following mandatory returnable documents.</p>
              
              <div className="space-y-3">
                {[
                  { name: 'Valid Tax Clearance Certificate', status: 'ready', note: 'Found in Memory Bank' },
                  { name: 'B-BBEE Sworn Affidavit / Certificate', status: 'ready', note: 'Found in Memory Bank (Valid until Dec 2026)' },
                  { name: 'CSD Registration Summary Report', status: 'missing', note: 'Not found in Memory Bank. Please upload.' },
                  { name: 'Completed SBD 4 Form (Declaration of Interest)', status: 'action', note: 'AI has drafted this. Requires manual signature.' },
                  { name: 'Proof of Professional Indemnity Insurance', status: 'ready', note: 'Found in Memory Bank' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      {item.status === 'ready' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                       item.status === 'missing' ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                       <Sparkles className="w-5 h-5 text-blue-500" />}
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
          <div className="flex-1 p-8 bg-white overflow-auto">
            <div className="max-w-4xl mx-auto text-left">
              <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">Pricing Schedule</h3>
              <p className="text-sm text-gray-500 mb-6">AI has structured your standard pricing into the format requested by Annexure B of the RFP.</p>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3">Resource / Deliverable</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Rate (ZAR)</th>
                      <th className="px-6 py-3">Total Excl. VAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-white">
                      <td className="px-6 py-4 font-medium">Cloud Infrastructure Setup</td>
                      <td className="px-6 py-4">Month 1</td>
                      <td className="px-6 py-4">R 150,000.00</td>
                      <td className="px-6 py-4">R 150,000.00</td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-6 py-4 font-medium">System Integration & Customization</td>
                      <td className="px-6 py-4">Months 2-3</td>
                      <td className="px-6 py-4">R 200,000.00 / mo</td>
                      <td className="px-6 py-4">R 400,000.00</td>
                    </tr>
                    <tr className="border-b bg-white">
                      <td className="px-6 py-4 font-medium">Annual Licensing & Support</td>
                      <td className="px-6 py-4">12 Months</td>
                      <td className="px-6 py-4">R 45,000.00 / mo</td>
                      <td className="px-6 py-4">R 540,000.00</td>
                    </tr>
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="px-6 py-4 text-right">Total Bid Price (Excl. VAT):</td>
                      <td className="px-6 py-4">R 1,090,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Methodology' && (
          <div className="flex-1 p-8 bg-white overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">Implementation Methodology</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Phase 1: Project Initiation & Scoping (Weeks 1-2)</h4>
                  <p className="text-sm text-gray-600">The AI pulled this phase from your standard "Agile Software Implementation" methodology stored in the Memory Bank. It has been tailored to specifically mention the stakeholders from this RFP.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Phase 2: Cloud Architecture & Deployment (Weeks 3-5)</h4>
                  <p className="text-sm text-gray-600">This section utilizes your standard AWS GovCloud deployment templates, ensuring compliance with South African data sovereignty requirements as stipulated in the RFP.</p>
                </div>
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">Phase 3: Legacy System Data Migration (Weeks 6-8)</h4>
                  <p className="text-sm text-blue-700"><strong>AI Generated Custom Section:</strong> Since this RFP specifically requires legacy migration from existing medical systems, the AI generated a custom methodology for ETL (Extract, Transform, Load) processes tailored to healthcare records.</p>
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
