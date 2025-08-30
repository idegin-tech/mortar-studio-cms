import { Request, Response, NextFunction, Router } from 'express'
import path from 'path'

type DatabaseType = 'mysql' | 'pg' | 'sqlite'

interface MortarStudioConfig {
    database?: {
        type: DatabaseType
        host?: string
        username?: string
        password?: string
        database: string
        ssl?: boolean
        connectionString?: string
    }
    host?: string
    basePath?: string
}

export interface MortarStudioOptions {
    config?: MortarStudioConfig
}

export function mortarStudio(options: MortarStudioOptions = {}) {
    const express = require('express')
    const router = Router()
    const basePath = options.config?.basePath || '/ms-admin'
    const hostUrl = options.config?.host || `http://localhost:${process.env.PORT || 3000}`
    
    const dashboardPath = path.join(__dirname, '../dashboard')

    router.get('/ms-admin/api/health', (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            config: options.config ? 'loaded' : 'default',
            host: hostUrl,
            environment: process.env.NODE_ENV || 'development'
        })
    })

    router.get('/ms-admin/api/config', (req: Request, res: Response) => {
        res.json({
            database: options.config?.database ? {
                type: options.config.database.type,
                database: options.config.database.database,
                connected: false,
                ssl: options.config.database.ssl || false
            } : null,
            host: hostUrl,
            basePath: basePath
        })
    })

    router.get('/ms-admin/api', (req: Request, res: Response) => {
        res.json({
            message: 'Mortar Studio API',
            version: '1.0.0',
            endpoints: [
                '/ms-admin/api/health',
                '/ms-admin/api/config'
            ],
            host: hostUrl
        })
    })

    router.post('/ms-admin/api/*', (req: Request, res: Response) => {
        res.json({
            message: 'API endpoint not implemented',
            path: req.path,
            method: req.method,
            host: hostUrl
        })
    })

    router.use('/ms-admin', express.static(dashboardPath))

    router.get('/ms-admin*', (req: Request, res: Response) => {
        res.sendFile(path.join(dashboardPath, 'index.html'))
    })

    return router
}

export const MortarStudioExpress = mortarStudio

export default mortarStudio