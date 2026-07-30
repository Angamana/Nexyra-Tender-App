import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 relative">
      <div className="absolute top-8 left-8">
        <div className="flex items-center gap-2">
          <img src="./logo.png" alt="NEXYRA Logo" className="h-8 w-8 object-contain" />
          <h1 className="text-xl font-bold tracking-wide">
            <span className="text-gray-900">NEXYRA</span><span className="text-gray-500 text-sm font-medium ml-1">Tenders</span>
          </h1>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
