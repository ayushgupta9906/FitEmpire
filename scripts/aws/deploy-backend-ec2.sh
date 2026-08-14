#!/bin/bash
# ==============================================================================
# FitEmpire - AWS EC2 Backend Deployment Script
# ==============================================================================
# Usage:
#   bash deploy-backend-ec2.sh
# ==============================================================================

set -e

APP_DIR="/opt/fitempire"
REPO_URL="https://github.com/ayushgupta9906/FitEmpire.git"

echo "========================================================"
echo "Deploying FitEmpire Backend on AWS EC2..."
echo "========================================================"

# 1. Clone or pull repo
if [ ! -d "$APP_DIR" ]; then
    echo "Cloning repository..."
    sudo git clone "$REPO_URL" "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
else
    echo "Pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
fi

cd "$APP_DIR/fitempire-backend"

# 2. Build production JAR
echo "Building Spring Boot Application..."
mvn clean package -DskipTests

JAR_FILE=$(ls target/fitempire-backend-*.jar | head -n 1)

# 3. Create Systemd Service for Auto-Restart & Background Execution
echo "Configuring Systemd Service..."
sudo tee /etc/systemd/system/fitempire-backend.service > /dev/null <<EOF
[Unit]
Description=FitEmpire Backend API
After=network.target

[Service]
User=$USER
WorkingDirectory=$APP_DIR/fitempire-backend
ExecStart=/usr/bin/java -Xms256m -Xmx768m -Dspring.profiles.active=prod -jar $APP_DIR/fitempire-backend/$JAR_FILE
SuccessExitStatus=143
Restart=always
RestartSec=10
EnvironmentFile=$APP_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

# 4. Reload and Restart Service
sudo systemctl daemon-reload
sudo systemctl enable fitempire-backend
sudo systemctl restart fitempire-backend

echo "========================================================"
echo "✓ FitEmpire Backend Deployed Successfully!"
echo "Service Status: sudo systemctl status fitempire-backend"
echo "Live Logs:      sudo journalctl -u fitempire-backend -f"
echo "========================================================"
