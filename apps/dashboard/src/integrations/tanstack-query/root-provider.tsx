import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query'
import { apiConfig } from '../../config/api'
import { ApiError, NetworkError } from '../../lib/api-client'

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Global error logging
        if (apiConfig.isLocal) {
          console.error('Query failed:', {
            queryKey: query.queryKey,
            error: error.message,
            stack: error.stack,
          })
        }
        
        // Handle specific error types
        if (error instanceof NetworkError) {
          console.warn('Network error occurred:', error.endpoint)
        } else if (error instanceof ApiError) {
          if (error.status >= 500) {
            console.error('Server error:', error.status, error.data)
          }
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, _context, mutation) => {
        if (apiConfig.isLocal) {
          console.error('Mutation failed:', {
            mutationKey: mutation.options.mutationKey,
            variables,
            error: error.message,
          })
        }
      },
    }),
    defaultOptions: {
      queries: {
        // Retry configuration
        retry: (failureCount, error) => {
          // Don't retry on client errors (4xx)
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false
          }
          
          // Don't retry on network timeouts after first attempt
          if (error instanceof NetworkError && error.message.includes('timeout')) {
            return failureCount < 1
          }
          
          // Retry server errors (5xx) up to 3 times with exponential backoff
          if (error instanceof ApiError && error.status >= 500) {
            return failureCount < 3
          }
          
          // Default retry for other errors
          return failureCount < 2
        },
        
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Cache configuration
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        
        // Refetch configuration
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: 'always',
        
        // Network mode
        networkMode: 'online',
        
        // Query timeout
        queryFn: undefined, // This will be overridden by individual queries
      },
      mutations: {
        // Don't retry mutations by default
        retry: false,
        
        // Network mode for mutations
        networkMode: 'online',
        
        // Mutation timeout
        mutationFn: undefined,
      },
    },
  })
}

export function getContext() {
  const queryClient = createQueryClient()

  if (apiConfig.isLocal) {
    console.log('🚀 Development mode: API calls will be made to:', apiConfig.baseUrl)
    console.log('📊 TanStack Query configured with production-ready defaults')
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
