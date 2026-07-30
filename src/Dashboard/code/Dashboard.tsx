import { useState } from 'react'
import { useTenders } from '../../Universal/code/lib/tenderContext'
import { Clock, ChevronRight, Activity, X, AlertTriangle } from 'lucide-react'
import { useCompany } from '../../Universal/code/lib/companyContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { tenders, deleteTender } = useTenders()
  const { activeCompany } = useCompany()
  const [tenderToDelete, setTenderToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'progress' | 'submitted'>('progress')

  const filteredTenders = tenders.filter(t => 
    (!activeCompany || t.companyId === activeCompany.id) &&
    (activeTab === 'progress' ? t.status === 'In Progress' : (t.status === 'Submitted' || t.status === 'Won' || t.status === 'Lost'))
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Project Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor ongoing compilations and track submitted bids.
          </p>
        </div>
        
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'progress' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'submitted' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Submitted & Tracked
          </button>
        </div>
      </div>

      {filteredTenders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === 'progress' ? 'No Active Tenders' : 'No Tracked Tenders'}
          </h2>
          <p className="text-gray-500 max-w-md text-center mb-6">
            {activeTab === 'progress' 
              ? (activeCompany ? `You don't have any tenders currently in progress for ${activeCompany.name}. Upload a new tender to begin.` : 'Please select a company from the top bar to view its active tenders.')
              : (activeCompany ? `You haven't submitted any tenders for ${activeCompany.name} yet.` : 'Please select a company to view its submitted tenders.')}
          </p>
          {activeCompany && activeTab === 'progress' && (
            <Link to="/tenders/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors">
              Upload New Tender
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenders.map((tender) => (
            <Link 
              key={tender.id} 
              to={`/tenders/${tender.id}`} 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all block relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setTenderToDelete(tender.id)
                }}
                className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"
                title="Delete Tender"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start justify-between mb-4 pr-6">
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100">
                  {tender.companyName}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                  tender.status === 'In Progress' ? 'text-gray-500 bg-gray-100' :
                  tender.status === 'Submitted' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                  tender.status === 'Won' ? 'text-green-600 bg-green-50 border border-green-100' :
                  'text-red-600 bg-red-50 border border-red-100'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  {tender.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                {tender.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{tender.refNumber}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Compliance Score</span>
                  <span className={`text-lg font-bold ${tender.score === 100 ? 'text-green-600' : 'text-orange-500'}`}>
                    {tender.score}%
                  </span>
                </div>
                <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tenderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Tender</h3>
              <p className="text-sm text-gray-500 text-center">
                Are you sure you want to permanently delete this tender project? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-center gap-3 border-t border-gray-100">
              <button 
                onClick={() => setTenderToDelete(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
              >
                No, Cancel
              </button>
              <button 
                onClick={() => {
                  deleteTender(tenderToDelete)
                  setTenderToDelete(null)
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
