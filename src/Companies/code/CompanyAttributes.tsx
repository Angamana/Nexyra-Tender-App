import { useState } from 'react'
import { useCompany } from '../../Universal/code/lib/companyContext'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

type AttributeDoc = {
  id: string
  name: string
  status: 'missing' | 'valid' | 'expiring' | 'expired'
  issueDate?: string
  expiryDate?: string
}

const DEFAULT_DOCS: AttributeDoc[] = [
  { id: 'ck', name: 'CIPC Registration (CK)', status: 'missing' },
  { id: 'id', name: 'Certified ID Copies (Directors)', status: 'missing' },
  { id: 'csd', name: 'CSD Summary Report', status: 'missing' },
  { id: 'bbbee', name: 'B-BBEE Certificate / Affidavit', status: 'missing' },
  { id: 'tax', name: 'Tax Clearance (TCC/PIN)', status: 'missing' },
  { id: 'coida', name: 'Letter of Good Standing (COIDA)', status: 'missing' },
]

export default function CompanyAttributes() {
  const { activeCompany } = useCompany()
  const [docs, setDocs] = useState<AttributeDoc[]>(DEFAULT_DOCS)

  if (!activeCompany) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Active Memory Bank</h2>
        <p className="text-gray-500 max-w-md text-center">Please select a company from the Companies tab to manage its attributes and documents.</p>
      </div>
    )
  }

  const handleSimulateUpload = (index: number) => {
    const updated = [...docs]
    updated[index] = {
      ...updated[index],
      status: 'valid',
      issueDate: new Date().toISOString().split('T')[0],
      // Simulate 1 year validity
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    }
    setDocs(updated)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Memory Bank: {activeCompany.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload static compliance documents. Our AI Engine will use these to score your tenders and auto-compile submissions.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Core Compliance Attributes</h2>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            {docs.filter(d => d.status === 'valid').length} / {docs.length} Uploaded
          </span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {docs.map((doc, idx) => (
            <div key={doc.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 ${doc.status === 'valid' ? 'text-green-500' : 'text-gray-400'}`}>
                  {doc.status === 'valid' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{doc.name}</h3>
                  {doc.status === 'valid' ? (
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Issued: {doc.issueDate}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Expires: {doc.expiryDate}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-red-500 mt-1 font-medium">Missing from Memory Bank</p>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {doc.status === 'valid' ? (
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    Replace Document
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSimulateUpload(idx)}
                    className="flex items-center gap-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload File
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
