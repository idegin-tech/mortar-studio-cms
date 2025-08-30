import { useQuery } from '@tanstack/react-query'
import { apiClient, ApiError, NetworkError } from '../lib/api-client'

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'ok'
  timestamp: string
  version?: string
  environment?: string
  config?: string
  database?: {
    status: 'connected' | 'disconnected'
    type?: string
  }
  uptime?: number
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<HealthStatus> => {
      try {
        const response = await apiClient.get<any>('/health')
        
        // Normalize the response to our expected format
        return {
          status: response.status === 'ok' ? 'healthy' : response.status || 'unhealthy',
          timestamp: response.timestamp || new Date().toISOString(),
          version: response.version,
          environment: response.environment,
          config: response.config,
          database: response.database,
          uptime: response.uptime,
        }
      } catch (error) {
        // Handle different error types
        if (error instanceof ApiError) {
          console.warn(`Health check API error: ${error.status} ${error.statusText}`)
          
          // For 5xx errors, return unhealthy status
          if (error.status >= 500) {
            return {
              status: 'unhealthy',
              timestamp: new Date().toISOString(),
              version: 'unknown',
              environment: 'unknown',
            }
          }
          
          // For 4xx errors, re-throw to let react-query handle retry logic
          throw error
        }
        
        if (error instanceof NetworkError) {
          console.warn('Health check network error:', error.message)
          return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            version: 'unknown',
            environment: 'offline',
          }
        }
        
        // For unknown errors, re-throw
        throw error
      }
    },
    // Health check specific configuration
    refetchInterval: (query) => {
      // If unhealthy, check more frequently
      if (query.state.data?.status === 'unhealthy') {
        return 10000 // 10 seconds
      }
      
      // If there's an error, check more frequently
      if (query.state.error) {
        return 15000 // 15 seconds
      }
      
      // Normal health check interval
      return 30000 // 30 seconds
    },
    
    // Shorter stale time for health checks
    staleTime: 10000, // 10 seconds
    
    // Keep health data in cache longer
    gcTime: 5 * 60 * 1000, // 5 minutes
    
    // Always refetch when component mounts
    refetchOnMount: true,
    
    // Refetch when window gains focus
    refetchOnWindowFocus: true,
    
    // Retry configuration specific to health checks
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (except 408 timeout)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 408) {
        return false
      }
      
      // Retry network errors once
      if (error instanceof NetworkError) {
        return failureCount < 1
      }
      
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    
    // Shorter retry delay for health checks
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(1.5, attemptIndex), 5000),
  })
}