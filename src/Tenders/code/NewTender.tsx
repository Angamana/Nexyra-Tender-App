import { useState, useRef } from 'react'
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle, Clock, File } from 'lucide-react'
import { useCompany } from '../../Universal/code/lib/companyContext'
import { useTenders } from '../../Universal/code/lib/tenderContext'
import { Link } from 'react-router-dom'

export default function NewTender() {
  const { activeCompany } = useCompany()
  const { addTender } = useTenders()
  
  const [isParsing, setIsParsing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!activeCompany) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Active Memory Bank</h2>
        <p className="text-gray-500 max-w-md text-center">You must select a company before uploading a new tender so the AI knows which Memory Bank to cross-reference.</p>
        <Link to="/companies" className="text-blue-600 hover:underline font-medium">Go to Companies</Link>
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      handleSimulateUpload(file)
    }
  }

  const handleSimulateUpload = (file: File) => {
    setIsParsing(true)
    setTimeout(() => {
      setIsParsing(false)
      
      const parsed = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Extract title from filename
        refNumber: 'RFP-2024-089',
        closingDate: '2026-08-15',
        closingTime: '11:00 AM',
        briefing: '2026-07-20 10:00 AM (Compulsory)',
        description: 'The provision of a comprehensive, cloud-based integrated medical management solution. Requires SOC 2 compliance, ISO 27001 certification, and a team of certified cloud architects for deployment.',
        requiredDocs: [
          { name: 'CIPC Registration (CK)', found: true, valid: true },
          { name: 'Certified ID Copies', found: true, valid: true },
          { name: 'Tax Clearance (TCC/PIN)', found: true, valid: false, reason: 'Expired 2 weeks ago' },
          { name: 'B-BBEE Certificate', found: false, valid: false, reason: 'Missing from Memory Bank' }
        ],
        complianceScore: 50
      }
      
      setParsedData(parsed)

      // Auto-save tender as "In Progress"
      if (activeCompany) {
        addTender({
          companyId: activeCompany.id,
          companyName: activeCompany.name,
          title: parsed.title,
          refNumber: parsed.refNumber,
          closingDate: parsed.closingDate,
          status: 'In Progress',
          score: parsed.complianceScore
        })
      }
    }, 3500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Upload New Tender</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload a tender document. The AI will parse the requirements and score it against <span className="font-semibold text-gray-700">{activeCompany.name}</span>.
        </p>
      </div>

      {!parsedData && !isParsing && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 text-blue-600">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Tender Document</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">Supports PDF, DOCX, and TXT files up to 50MB.</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm"
          >
            <File className="w-4 h-4" />
            Browse Files
          </button>
        </div>
      )}

      {isParsing && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Engine Processing...</h3>
            <p className="text-sm text-gray-500 mt-1">Reading document: {selectedFile?.name}. Extracting requirements and cross-referencing Memory Bank.</p>
          </div>
        </div>
      )}

      {parsedData && !isParsing && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Tender Overview Extracted</h2>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider">
                Parsed by AI
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Project Name</p>
                <p className="font-medium text-gray-900">{parsedData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Bid / Reference Number</p>
                <p className="font-medium text-gray-900">{parsedData.refNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Closing</p>
                <p className="font-medium flex items-center gap-2 text-gray-900">
                  <Clock className="w-4 h-4 text-orange-500" /> 
                  {parsedData.closingDate} at {parsedData.closingTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Briefing Session</p>
                <p className="font-medium flex items-center gap-2 text-gray-900">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {parsedData.briefing}
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-2 font-medium">Executive Summary & Technical Requirements</p>
                <p className="text-sm text-gray-800 leading-relaxed">{parsedData.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Compliance Scoring vs Memory Bank</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Current Score:</span>
                <span className={`text-lg font-bold ${parsedData.complianceScore === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                  {parsedData.complianceScore}%
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {parsedData.requiredDocs.map((doc: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {doc.valid ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium text-sm text-gray-900">{doc.name}</span>
                  </div>
                  {!doc.valid && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                      {doc.reason}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {parsedData.complianceScore < 100 && (
              <div className="p-4 bg-orange-50 border-t border-orange-100">
                <p className="text-sm text-orange-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <strong>Action Required:</strong> Please upload the missing or expired documents to the Memory Bank to achieve 100% compliance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
