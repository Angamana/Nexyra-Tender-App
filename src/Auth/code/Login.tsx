import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Universal/code/lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const success = signIn(email, password)
    if (success) {
      navigate('/')
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your memory bank.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
            placeholder="Email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
            placeholder="Password"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
        <span className="text-xs text-center text-gray-500 uppercase">Or continue with</span>
        <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
      </div>

      <div className="mt-6 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-medium rounded-md transition-colors shadow-sm">
          <img src="/google.png" alt="Google" className="w-5 h-5 object-contain" />
          Google
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-medium rounded-md transition-colors shadow-sm">
          <img src="/microsoft.png" alt="Microsoft" className="w-5 h-5 object-contain" />
          Microsoft
        </button>
      </div>
    </div>
  )
}
