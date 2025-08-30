import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: WelcomePage,
})

function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Mortar Studio CMS
          </CardTitle>
          <CardDescription className="text-lg">
            A powerful content management system for modern applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Get started by accessing the admin panel to manage your content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/ms-admin'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Access Admin Panel
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://github.com/idegin-tech/mortar-studio-cms', '_blank')}
              >
                View Documentation
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold text-sm text-foreground">Content Management</h3>
              <p className="text-xs text-muted-foreground mt-1">Create and manage your content with ease</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold text-sm text-foreground">Modern UI</h3>
              <p className="text-xs text-muted-foreground mt-1">Beautiful interface built with Shadcn UI</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold text-sm text-foreground">Developer Friendly</h3>
              <p className="text-xs text-muted-foreground mt-1">Easy to integrate and customize</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
