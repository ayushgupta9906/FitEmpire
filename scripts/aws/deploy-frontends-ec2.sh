#!/bin/bash
# ==============================================================================
# FitEmpire - Deploy All Frontends on Same EC2 Instance (100% Free)
# ==============================================================================

set -e

echo "========================================================"
echo "Deploying FitEmpire Frontends on AWS EC2..."
echo "========================================================"

APP_DIR="/opt/fitempire"

# 1. Install Node.js & NPM on EC2 if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node Version: $(node -v)"
echo "NPM Version:  $(npm -v)"

# 2. Build Admin Console
echo "Building Admin Console..."
cd "$APP_DIR/fitempire-admin"
npm install --legacy-peer-deps
VITE_API_BASE_URL="/api" npm run build

# 3. Build Partner Portal
echo "Building Partner Portal..."
cd "$APP_DIR/fitempire-partner"
npm install --legacy-peer-deps
VITE_API_URL="/api" npm run build

# 4. Copy build artifacts to /var/www/
echo "Deploying build artifacts to Nginx web root..."
sudo mkdir -p /var/www/fitempire-admin /var/www/fitempire-partner
sudo cp -r "$APP_DIR/fitempire-admin/dist/"* /var/www/fitempire-admin/
sudo cp -r "$APP_DIR/fitempire-partner/dist/"* /var/www/fitempire-partner/
sudo chown -R www-data:www-data /var/www/fitempire-admin /var/www/fitempire-partner

# 5. Configure Unified Nginx (Frontends + Backend in One Host)
echo "Configuring Unified Nginx Reverse Proxy..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # 1. Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2. Swagger UI
    location /swagger-ui/ {
        proxy_pass http://127.0.0.1:8080/swagger-ui/;
        proxy_set_header Host $host;
    }

    location /v1/api-docs {
        proxy_pass http://127.0.0.1:8080/v1/api-docs;
        proxy_set_header Host $host;
    }

    # 3. Partner Portal (/partner/)
    location /partner {
        alias /var/www/fitempire-partner;
        try_files $uri $uri/ /partner/index.html;
    }

    # 4. Admin Dashboard (Root /)
    location / {
        root /var/www/fitempire-admin;
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo nginx -t && sudo systemctl restart nginx

echo "========================================================"
echo "✓ ALL FRONTENDS DEPLOYED ON AWS EC2!"
echo "Admin Dashboard: http://3.109.213.45/"
echo "Partner Portal:  http://3.109.213.45/partner"
echo "Backend API:     http://3.109.213.45/api/v1"
echo "========================================================"
