import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Universal/code/lib/auth'
import { UserPlus, LogIn, Building2, User as UserIcon, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    if (isSignUp) {
      signUp(name, email, password, organization)
      navigate('/')
    } else {
      const res = signIn(email, password)
      if (res.success) {
        navigate('/')
      } else {
        setError(res.message || 'Login failed.')
      }
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
      {/* Mode Selector Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setIsSignUp(false); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
            !isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUp(true); setError(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
            isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Create Profile
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isSignUp ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isSignUp
            ? 'Set up your individual workspace profile.'
            : 'Access your saved tenders and memory bank.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        {isSignUp && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                placeholder="Jane Doe"
                required={isSignUp}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              required
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              required
              placeholder="••••••••"
            />
          </div>
        </div>

        {isSignUp && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Organization / Company
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                placeholder="Acme Corp"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg mt-2"
        >
          {isSignUp ? 'Create Profile & Enter Workspace' : 'Sign In to Workspace'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
        <span className="text-xs text-center text-gray-500 uppercase">Or continue with</span>
        <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
      </div>

      <div className="mt-6 space-y-3">
        <button type="button" className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-medium rounded-md transition-colors shadow-sm">
          <img src="./google.png" alt="Google" className="w-5 h-5 object-contain" />
          Google
        </button>
        <button type="button" className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-medium rounded-md transition-colors shadow-sm">
          <img src="./microsoft.png" alt="Microsoft" className="w-5 h-5 object-contain" />
          Microsoft
        </button>
      </div>
    </div>
  )
}
