
# QR Café - Complete Project Setup Instructions

## Prerequisites for Windows 11

1. **Install Docker Desktop**
   - Download from: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
   - Follow installation wizard
   - Restart your computer
   - Ensure Docker Desktop is running

2. **Install Git**
   - Download from: https://git-scm.com/download/win
   - Use default settings during installation

3. **Install Node.js (for local development)**
   - Download from: https://nodejs.org/ (LTS version)
   - This is optional but recommended for local development

## Quick Start (Easiest Method)

1. **Download and Extract Project**
   - Download the complete project folder
   - Extract to `C:\qr-cafe\` (or any preferred location)

2. **Run Setup Script**
   ```powershell
   # Open PowerShell as Administrator
   cd C:\qr-cafe
   .\setup-windows.ps1
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3030 (admin:admin123)
   - MongoDB: http://localhost:27017

## Manual Setup (Alternative Method)

### Step 1: Clone/Download Project
```bash
git clone <your-repo-url>
cd qr-cafe
```

### Step 2: Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d --build

# Check if all services are running
docker-compose ps

# View logs if needed
docker-compose logs -f
```

### Step 3: Initialize Database
The MongoDB will be automatically initialized with sample data using the `mongo-init.js` script.

## Project Structure

```
qr-cafe/
├── src/                          # React Frontend
│   ├── components/               # React Components
│   ├── services/                # API Services
│   └── ...
├── backend/                      # Node.js Backend
│   ├── models/                  # MongoDB Models
│   ├── routes/                  # API Routes
│   ├── config/                  # Database Config
│   └── server.js               # Main Server File
├── k8s/                         # Kubernetes Manifests
├── monitoring/                  # Prometheus/Grafana Config
├── docker-compose.yml          # Local Development
├── setup-windows.ps1           # Windows Setup Script
└── README.md
```

## Services Overview

### Frontend (React)
- **Port**: 3000
- **Technology**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Features**: Customer menu, owner dashboard, cart system

### Backend (Node.js)
- **Port**: 3001
- **Technology**: Express.js, MongoDB, JWT
- **APIs**: Cafes, Menu, Orders, QR generation

### Database (MongoDB)
- **Port**: 27017
- **Data**: Cafes, menu items, orders
- **Sample Data**: Pre-loaded with sample cafe

### Monitoring Stack
- **Prometheus**: http://localhost:9090 (Metrics collection)
- **Grafana**: http://localhost:3030 (Dashboards)
- **Alertmanager**: http://localhost:9093 (Alerts)

## Development Workflow

### Adding New Features
1. **Frontend Changes**: Edit files in `src/`
2. **Backend Changes**: Edit files in `backend/`
3. **Database Changes**: Update models in `backend/models/`

### Testing Locally
1. **Start Development Server**:
   ```bash
   # Frontend (in src/)
   npm run dev
   
   # Backend (in backend/)
   npm run dev
   ```

2. **Use Docker for Full Stack**:
   ```bash
   docker-compose up -d --build
   ```

## Production Deployment

### Using Kubernetes
1. **Apply Kubernetes manifests**:
   ```bash
   kubectl apply -f k8s/
   ```

2. **Monitor deployment**:
   ```bash
   kubectl get pods -n qr-cafe
   ```

### Using CI/CD (GitHub Actions)
1. **Push to GitHub**
2. **GitHub Actions will automatically**:
   - Build Docker images
   - Run security scans
   - Deploy to Kubernetes
   - Send notifications

## Troubleshooting

### Common Issues

1. **"Failed to connect to server"**
   - Ensure Docker is running
   - Check if backend container is up: `docker-compose ps`
   - Restart services: `docker-compose restart`

2. **"Cafe not found"**
   - Check if MongoDB is initialized
   - Verify sample data: `docker-compose logs mongodb`

3. **Port conflicts**
   - Stop other services using ports 3000, 3001, 27017
   - Or modify ports in `docker-compose.yml`

### Logs and Debugging
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## Environment Variables

Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/qrcafe
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

## Data Persistence

- **MongoDB Data**: Stored in Docker volume `mongodb_data`
- **Cart Data**: Stored in browser localStorage
- **Session Data**: Managed by JWT tokens

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **JWT**: Secure authentication
- **Input Validation**: Server-side validation

## Monitoring and Alerts

- **Health Checks**: `/health` endpoint
- **Metrics**: Custom Prometheus metrics
- **Dashboards**: Pre-configured Grafana dashboards
- **Alerts**: Email notifications for issues

## Support

For issues or questions:
1. Check logs using `docker-compose logs`
2. Verify all containers are running: `docker-compose ps`
3. Review this documentation
4. Check GitHub issues (if applicable)
