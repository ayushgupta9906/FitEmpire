#!/bin/bash
# ==============================================================================
# FitEmpire - Local PostgreSQL Setup on EC2
# ==============================================================================

set -e

echo "========================================================"
echo "Installing and Configuring Local PostgreSQL on EC2..."
echo "========================================================"

# 1. Install PostgreSQL
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y
sudo apt-get install -y postgresql postgresql-contrib

# 2. Start and Enable PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 3. Create Database & User
DB_NAME="fitempire"
DB_USER="fitempire_admin"
DB_PASS="FitEmpireSecure@2026"

echo "Creating PostgreSQL Database: $DB_NAME..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

echo "Creating PostgreSQL User: $DB_USER..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "ALTER SCHEMA public OWNER TO $DB_USER;"

# 4. Update /opt/fitempire/.env to use Local PostgreSQL
echo "Updating /opt/fitempire/.env to use Local PostgreSQL..."
cat << 'EOF' > /opt/fitempire/.env
# ---- Local EC2 PostgreSQL ----
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitempire
DB_USER=fitempire_admin
DB_PASSWORD=FitEmpireSecure@2026
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/fitempire
SPRING_DATASOURCE_USERNAME=fitempire_admin
SPRING_DATASOURCE_PASSWORD=FitEmpireSecure@2026

# ---- Spring Boot Profile ----
SPRING_PROFILES_ACTIVE=dev

# ---- AWS S3 Bucket ----
AWS_REGION=ap-south-1
AWS_S3_BUCKET=fitempire
AWS_CDN_URL=https://fitempire.s3.ap-south-1.amazonaws.com

# ---- Admin Default Credentials ----
ADMIN_DEFAULT_EMAIL=admin@fitempire.in
ADMIN_DEFAULT_PASSWORD=AdminPassword@123

# ---- Twilio SMS ----
TWILIO_ACCOUNT_SID=AC61d9f9916a29a2677764c49a80ec9112
TWILIO_AUTH_TOKEN=499d08545b0cdbe581fab021db507cb7
TWILIO_FROM_NUMBER=+16592745532
EOF

# 5. Restart Backend Service to auto-create tables & seed data
echo "Restarting FitEmpire Backend on Local Database..."
sudo systemctl restart fitempire-backend

echo "========================================================"
echo "✓ Local PostgreSQL Installed & Connected Successfully!"
echo "Database Name: $DB_NAME"
echo "Database Host: localhost:5432"
echo "Status Check:  sudo systemctl status fitempire-backend"
echo "========================================================"
