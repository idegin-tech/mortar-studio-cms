export interface ApiConfig {
    baseUrl: string
    isLocal: boolean
    timeout: number
    retryAttempts: number
    retryDelay: number
    enableLogging: boolean
}

export function getApiConfig(): ApiConfig {
    const nodeEnv = import.meta.env.VITE_NODE_ENV || import.meta.env.NODE_ENV
    const isLocal = nodeEnv === 'local'
    const isDevelopment = nodeEnv === 'development'

    let baseUrl: string

    if (isLocal) {
        baseUrl = 'http://localhost:3000/ms-admin/api'
    } else {
        const currentHost = window.location.origin
        baseUrl = `${currentHost}/ms-admin/api`
    }

    return {
        baseUrl,
        isLocal,
        timeout: isLocal ? 10000 : 30000, // 10s for local, 30s for production
        retryAttempts: isLocal ? 2 : 3,
        retryDelay: isLocal ? 1000 : 2000,
        enableLogging: isLocal || isDevelopment,
    }
}

export const apiConfig = getApiConfig()

// Log configuration in development
if (apiConfig.enableLogging) {
    console.log('🔧 API Configuration:', {
        baseUrl: apiConfig.baseUrl,
        environment: apiConfig.isLocal ? 'local' : 'production',
        timeout: `${apiConfig.timeout}ms`,
        retryAttempts: apiConfig.retryAttempts,
        retryDelay: `${apiConfig.retryDelay}ms`,
    })
}