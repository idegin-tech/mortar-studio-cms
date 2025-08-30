import { createFileRoute } from '@tanstack/react-router'
import { apiConfig } from '../config/api'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mortar Studio CMS
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Content Management System Dashboard
            </p>
            
            <div className="bg-white overflow-hidden shadow rounded-lg max-w-md mx-auto">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  System Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Environment:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {apiConfig.isLocal ? 'Development' : 'Production'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">API Endpoint:</span>
                    <span className="text-sm font-medium text-gray-900 truncate ml-2">
                      {apiConfig.baseUrl}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Base Path:</span>
                    <span className="text-sm font-medium text-gray-900">
                      /ms-admin/
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
