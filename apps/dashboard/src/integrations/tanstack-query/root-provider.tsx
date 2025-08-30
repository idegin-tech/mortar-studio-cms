import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiConfig } from '../../config/api'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('404')) {
            return false
          }
          return failureCount < 3
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  if (apiConfig.isLocal) {
    console.log('🚀 Development mode: API calls will be made to:', apiConfig.baseUrl)
  }

  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
