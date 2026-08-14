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

# 1. Configure Resilient Systemd Service
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
RestartSec=5s
KillMode=process
EnvironmentFile=$APP_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

# 2. Enable Auto-Start on System Boot
sudo systemctl daemon-reload
sudo systemctl enable postgresql
sudo systemctl enable nginx
sudo systemctl enable fitempire-backend

sudo systemctl restart postgresql
sudo systemctl restart nginx
sudo systemctl restart fitempire-backend

# 3. Create Auto-Recovery Watchdog Cron (Checks every 2 minutes)
sudo tee /usr/local/bin/fitempire-watchdog.sh > /dev/null << 'EOF'
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/api/v1/ecosystem/activities || echo "000")
if [ "$STATUS" != "200" ]; then
    echo "$(date): Backend unhealthy (HTTP $STATUS), auto-restarting..." >> /var/log/fitempire-watchdog.log
    sudo systemctl restart fitempire-backend
fi
EOF

sudo chmod +x /usr/local/bin/fitempire-watchdog.sh

# Add to root crontab if not already present
(crontab -l 2>/dev/null | grep -v 'fitempire-watchdog' ; echo "*/2 * * * * /usr/local/bin/fitempire-watchdog.sh") | crontab -

echo "========================================================"
echo "✓ 24/7 ALWAYS-ON MODE ACTIVATED!"
echo "1. Systemd auto-restarts within 5 seconds on any crash."
echo "2. Service auto-starts on EC2 server reboot."
echo "3. Watchdog monitor checks health every 2 minutes."
echo "========================================================"
