# 📊 System Metrics Dashboard

A real-time system monitoring dashboard built with Go backend and React frontend that displays live CPU and memory usage metrics.

![Dashboard](https://img.shields.io/badge/Status-Operational-brightgreen) ![Go](https://img.shields.io/badge/Go-1.21+-blue) ![React](https://img.shields.io/badge/React-18.2.0-61dafb) ![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

- **Real-time Monitoring**: Live CPU and memory usage metrics updated every 2 seconds
- **Beautiful Dashboard**: Modern React interface with responsive charts
- **Prometheus Integration**: Exposes metrics in standard Prometheus format
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **CORS Enabled**: Properly configured for frontend-backend communication
- **Health Checks**: Built-in health monitoring endpoints


## 🚀 Quick Start

### Prerequisites

- **Go** 1.21 or higher
- **Node.js** 16 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/metrics-dashboard.git
   cd metrics-dashboard
2. **Setup the Backend**
    ```bash
    cd backend
    go mod download
3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
## Running the Application
Manual Start (Recommended for Development)
  ```bash
    # Terminal 1 - Start Backend
    cd backend
    go run main.go
    
    # Terminal 2 - Start Frontend  
    cd frontend
    npm run dev
```
## Access Points

- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)  
- **Backend Metrics:** [http://localhost:8080/metrics](http://localhost:8080/metrics)  
- **Health Check:** [http://localhost:8080/health](http://localhost:8080/health)  
- **Main Endpoint:** [http://localhost:8080/](http://localhost:8080/)  

## 📊 Available Metrics

The dashboard collects and displays:

- **System Metrics**
  - `cpu_usage_percent` – Current CPU utilization percentage  
  - `memory_usage_bytes` – Active memory usage in bytes  
  - `memory_total_bytes` – Total available memory in bytes  

