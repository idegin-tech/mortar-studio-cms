const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

async function buildDashboard() {
  console.log('Building dashboard...')
  
  const dashboardDir = path.resolve(__dirname, '../../../apps/dashboard')
  const packageDir = path.resolve(__dirname, '..')
  const dashboardOutputDir = path.join(packageDir, 'dashboard')
  
  try {
    process.chdir(dashboardDir)
    
    console.log('Installing dashboard dependencies...')
    execSync('npm install', { stdio: 'inherit' })
    
    console.log('Building dashboard with Vite...')
    execSync('npm run build', { stdio: 'inherit' })
    
    console.log('Copying dashboard build to mortar-studio package...')
    const dashboardDistDir = path.join(dashboardDir, 'dist')
    
    if (await fs.pathExists(dashboardDistDir)) {
      await fs.ensureDir(dashboardOutputDir)
      await fs.emptyDir(dashboardOutputDir)
      await fs.copy(dashboardDistDir, dashboardOutputDir)
      console.log(`Dashboard build copied to ${dashboardOutputDir}`)
    } else {
      throw new Error(`Dashboard dist directory not found at ${dashboardDistDir}`)
    }
    
    console.log('Dashboard build completed successfully!')
    
  } catch (error) {
    console.error('Error building dashboard:', error.message)
    process.exit(1)
  }
}

buildDashboard()