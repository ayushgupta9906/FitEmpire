#!/bin/bash
# ==============================================================================
# FitEmpire - AWS EC2 Backend Automated Deployment Script
# ==============================================================================

set -e

APP_DIR="/opt/fitempire"
REPO_URL="https://github.com/ayushgupta9906/FitEmpire.git"

echo "========================================================"
echo "Deploying FitEmpire Backend on AWS EC2..."
echo "========================================================"

# 1. Clone or Pull Repo
if [ ! -d "$APP_DIR" ]; then
    echo "Cloning repository..."
    sudo git clone "$REPO_URL" "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
else
    echo "Pulling latest changes..."
    cd "$APP_DIR"
    git checkout main || true
    git pull origin main
fi

# 2. Write Production Environment File
echo "Configuring Production Environment..."
cat << 'EOF' > "$APP_DIR/.env"
# ---- Neon Cloud PostgreSQL ----
DB_HOST=ep-lingering-sky-atwtj0vn-pooler.c-9.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_BsZ4re0zCHiS
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-lingering-sky-atwtj0vn-pooler.c-9.us-east-1.aws.neon.tech:5432/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=npg_BsZ4re0zCHiS

# ---- Spring Boot Profile ----
SPRING_PROFILES_ACTIVE=dev

# ---- AWS S3 Bucket ----
AWS_REGION=ap-south-1
AWS_S3_BUCKET=fitempire
AWS_CDN_URL=https://fitempire.s3.ap-south-1.amazonaws.com

# ---- Admin Credentials ----
ADMIN_DEFAULT_EMAIL=admin@fitempire.in
ADMIN_DEFAULT_PASSWORD=AdminPassword@123

# ---- Twilio SMS ----
TWILIO_ACCOUNT_SID=AC61d9f9916a29a2677764c49a80ec9112
TWILIO_AUTH_TOKEN=499d08545b0cdbe581fab021db507cb7
TWILIO_FROM_NUMBER=+16592745532
EOF

# 3. Configure Nginx Reverse Proxy
echo "Configuring Nginx Reverse Proxy..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 120s;
    }

    location /swagger-ui/ {
        proxy_pass http://127.0.0.1:8080/swagger-ui/;
        proxy_set_header Host $host;
    }

    location /v1/api-docs {
        proxy_pass http://127.0.0.1:8080/v1/api-docs;
        proxy_set_header Host $host;
    }

    location /health {
        proxy_pass http://127.0.0.1:8080/api/v1/actuator/health;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

sudo nginx -t && sudo systemctl restart nginx

# 4. Build Spring Boot Application
cd "$APP_DIR/fitempire-backend"
echo "Building Spring Boot Application with Maven (this may take ~1 minute)..."
export MAVEN_OPTS="-Xms256m -Xmx512m"
mvn clean package -DskipTests

JAR_FILE=$(ls target/fitempire-backend-*.jar | head -n 1)

# 5. Setup Systemd Service
echo "Configuring Systemd Service (fitempire-backend)..."
sudo tee /etc/systemd/system/fitempire-backend.service > /dev/null << EOF
[Unit]
Description=FitEmpire Backend API
After=network.target

[Service]
User=$USER
WorkingDirectory=$APP_DIR/fitempire-backend
ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar $APP_DIR/fitempire-backend/$JAR_FILE
SuccessExitStatus=143
Restart=always
RestartSec=10
EnvironmentFile=$APP_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

# 6. Start the Service
sudo systemctl daemon-reload
sudo systemctl enable fitempire-backend
sudo systemctl restart fitempire-backend

echo "========================================================"
echo "✓ FitEmpire Backend Deployed Successfully on EC2!"
echo "Public API: http://$(curl -s http://checkip.amazonaws.com)/api/v1"
echo "Swagger UI: http://$(curl -s http://checkip.amazonaws.com)/swagger-ui.html"
echo "Check Logs: sudo journalctl -u fitempire-backend -f"
echo "========================================================"
