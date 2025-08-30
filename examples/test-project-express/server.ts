import express from 'express'
import cors from 'cors'
import { MortarStudioExpress } from 'mortar-studio'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false
}))

app.use(express.json())

app.use(MortarStudioExpress({
    config: {
        database: {
            type: 'sqlite',
            host: 'localhost',
            username: 'test',
            password: 'test',
            database: 'mortar_studio_test',
            ssl: false
        },
    }
}))

app.get('/', (req, res) => {
    res.json({
        message: 'Test Express Server with Mortar Studio',
        endpoints: [
            '/ms-admin',
            '/ms-admin/api/health',
            '/ms-admin/api/config'
        ]
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Mortar Studio available at http://localhost:${PORT}/ms-admin`)
})