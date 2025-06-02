
# QR Café Windows Setup Script
# Run this script in PowerShell as Administrator

Write-Host "🚀 Setting up QR Café on Windows..." -ForegroundColor Green

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prerequisites check passed!" -ForegroundColor Green

# Create necessary directories
Write-Host "📁 Creating directories..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "backend/logs"
New-Item -ItemType Directory -Force -Path "monitoring/data"

# Start Docker Desktop if not running
Write-Host "🐳 Checking Docker status..." -ForegroundColor Blue
$dockerStatus = docker info 2>$null
if (!$dockerStatus) {
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting for Docker to start..." -ForegroundColor Yellow
    Start-Sleep 30
}

# Create environment file
Write-Host "⚙️ Setting up environment..." -ForegroundColor Blue
if (!(Test-Path "backend/.env")) {
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "Created backend/.env file. Please update with your configuration." -ForegroundColor Yellow
}

# Build and start services
Write-Host "🏗️ Building and starting services..." -ForegroundColor Blue
docker-compose down
docker-compose up -d --build

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Blue
Start-Sleep 60

# Check service health
Write-Host "🔍 Checking service health..." -ForegroundColor Blue

$services = @(
    @{Name="Frontend"; URL="http://localhost:3000"; Port=3000},
    @{Name="Backend"; URL="http://localhost:3001/health"; Port=3001},
    @{Name="MongoDB"; URL=""; Port=27017},
    @{Name="Prometheus"; URL="http://localhost:9090"; Port=9090},
    @{Name="Grafana"; URL="http://localhost:3030"; Port=3030}
)

foreach ($service in $services) {
    try {
        if ($service.URL) {
            $response = Invoke-WebRequest -Uri $service.URL -UseBasicParsing -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $($service.Name) is running" -ForegroundColor Green
            }
        } else {
            $connection = Test-NetConnection -ComputerName localhost -Port $service.Port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                Write-Host "✅ $($service.Name) is running" -ForegroundColor Green
            }
        }
    }
    catch {
        Write-Host "❌ $($service.Name) is not responding" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 QR Café setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Access your services:" -ForegroundColor Cyan
Write-Host "   🌐 QR Café App:     http://localhost:3000" -ForegroundColor White
Write-Host "   📡 Backend API:     http://localhost:3001" -ForegroundColor White
Write-Host "   📈 Prometheus:      http://localhost:9090" -ForegroundColor White
Write-Host "   📊 Grafana:         http://localhost:3030 (admin:admin123)" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:          docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop services:      docker-compose down" -ForegroundColor White
Write-Host "   Restart services:   docker-compose restart" -ForegroundColor White
Write-Host "   Update services:    docker-compose pull && docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:3000 to create your first café" -ForegroundColor White
Write-Host "   2. Set up Grafana dashboards at http://localhost:3030" -ForegroundColor White
Write-Host "   3. Configure email alerts in monitoring/alertmanager.yml" -ForegroundColor White
Write-Host ""
Write-Host "🗃️ Database Info:" -ForegroundColor Cyan
Write-Host "   - MongoDB stores all cafe and menu data" -ForegroundColor White
Write-Host "   - Sample cafe with menu items is pre-loaded" -ForegroundColor White
Write-Host "   - Data persists between container restarts" -ForegroundColor White
Write-Host ""

