import { Building2, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCompany } from '../../Universal/code/lib/companyContext'

export default function CompanyList() {
  const { companies, setActiveCompany, activeCompany } = useCompany()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Company Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your distinct business entities and their compliance memories.</p>
        </div>
        <Link to="/companies/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Company
        </Link>
      </div>
      
      {companies.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No companies found</h3>
          <p className="text-gray-500 max-w-sm mt-2 mb-6">
            You haven't created any company profiles yet. Add a new company to start building its compliance memory bank.
          </p>
          <Link to="/companies/new" className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-md font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Create First Company
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <div key={company.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative">
              {activeCompany?.id === company.id && (
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                  Active
                </span>
              )}
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 border border-blue-100">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p><span className="font-medium text-gray-700">Reg:</span> {company.registration_number}</p>
                <p><span className="font-medium text-gray-700">Industry:</span> {company.industry}</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button 
                  onClick={() => setActiveCompany(company)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeCompany?.id === company.id 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={activeCompany?.id === company.id}
                >
                  {activeCompany?.id === company.id ? 'Selected' : 'Select'}
                </button>
                <button className="flex items-center justify-center w-10 h-10 border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-md transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
