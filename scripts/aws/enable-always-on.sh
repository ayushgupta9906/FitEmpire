#!/bin/bash
# ==============================================================================
# FitEmpire - 24/7 Always-On Backend & Auto-Recovery Setup
# ==============================================================================

set -e

echo "========================================================"
echo "Configuring 24/7 Always-On High Availability Service..."
echo "========================================================"

APP_DIR="/opt/fitempire"
JAR_FILE=$(ls $APP_DIR/fitempire-backend/target/fitempire-backend-*.jar | head -n 1)

# 1. Clean crontab to remove any loop restart watchdog
sudo crontab -r 2>/dev/null || true
crontab -r 2>/dev/null || true

# 2. Configure Resilient Systemd Service
sudo tee /etc/systemd/system/fitempire-backend.service > /dev/null << EOF
[Unit]
Description=FitEmpire Backend 24/7 API Service
After=network.target postgresql.service
Requires=postgresql.service

[Service]
User=$USER
WorkingDirectory=$APP_DIR/fitempire-backend
ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar $JAR_FILE
Restart=always
RestartSec=10s
KillMode=process
TimeoutStartSec=120
EnvironmentFile=$APP_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

# 3. Enable Auto-Start on System Boot
sudo fuser -k 8080/tcp 2>/dev/null || true
sudo systemctl daemon-reload
sudo systemctl enable postgresql
sudo systemctl enable nginx
sudo systemctl enable fitempire-backend

sudo systemctl restart postgresql
sudo systemctl restart nginx
sudo systemctl restart fitempire-backend

echo "========================================================"
echo "✓ 24/7 ALWAYS-ON MODE ACTIVATED!"
echo "Spring Boot starting up cleanly without any conflicting watchdog..."
echo "Check live logs: sudo journalctl -u fitempire-backend -f"
echo "========================================================"
