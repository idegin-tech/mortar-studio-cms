export interface ApiConfig {
    baseUrl: string
    isLocal: boolean
}

export function getApiConfig(): ApiConfig {
    const nodeEnv = import.meta.env.VITE_NODE_ENV || import.meta.env.NODE_ENV
    const isLocal = nodeEnv === 'local'

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
    }
}

export const apiConfig = getApiConfig()