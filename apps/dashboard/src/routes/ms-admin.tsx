import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../components/auth/Login'

export const Route = createFileRoute('/ms-admin')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Login functionality will be implemented later')
  }

  return <Login onLogin={handleLogin} />
}
