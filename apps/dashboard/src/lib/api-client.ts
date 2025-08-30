import { apiConfig } from '../config/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any,
    public endpoint?: string
  ) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(public originalError: Error, public endpoint?: string) {
    super(`Network Error: ${originalError.message}`)
    this.name = 'NetworkError'
  }
}

export interface ApiClient {
  get: <T>(endpoint: string, options?: RequestInit) => Promise<T>
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => Promise<T>
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => Promise<T>
  delete: <T>(endpoint: string, options?: RequestInit) => Promise<T>
}

class DefaultApiClient implements ApiClient {
  private baseUrl: string
  private timeout: number
  private enableLogging: boolean

  constructor() {
    this.baseUrl = apiConfig.baseUrl
    this.timeout = apiConfig.timeout
    this.enableLogging = apiConfig.enableLogging
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    }

    if (this.enableLogging) {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`)
    }

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      if (this.enableLogging) {
        console.log(`📡 API Response: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: response.statusText }
        }
        
        throw new ApiError(
          response.status,
          response.statusText,
          errorData,
          endpoint
        )
      }

      if (response.status === 204) {
        return {} as T
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      }

      return response.text() as T
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (this.enableLogging) {
        console.error(`❌ API Error: ${endpoint}`, error)
      }
      
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError(new Error('Request timeout'), endpoint)
        }
        throw new NetworkError(error, endpoint)
      }

      throw new NetworkError(new Error('Unknown error occurred'), endpoint)
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { 
      method: 'GET',
      ...options 
    })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { 
      method: 'DELETE',
      ...options 
    })
  }
}

export const apiClient = new DefaultApiClient()