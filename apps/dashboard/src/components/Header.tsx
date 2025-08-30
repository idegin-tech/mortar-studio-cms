import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="text-2xl font-bold text-gray-900 hover:text-gray-700"
              >
                Mortar Studio
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">CMS Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  )
}
