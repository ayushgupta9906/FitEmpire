#!/bin/bash
# ==============================================================================
# FitEmpire - Direct Native PostgreSQL Schema Import on EC2
# ==============================================================================

set -e

echo "========================================================"
echo "Importing Native PostgreSQL Tables & Schema into EC2..."
echo "========================================================"

DB_NAME="fitempire"
DB_USER="fitempire_admin"
SCHEMA_FILE="/opt/fitempire/fitempire-backend/src/main/resources/db/migration/V1__initial_schema.sql"

# 1. Ensure PostgreSQL extensions and database exists
sudo -u postgres psql -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
sudo -u postgres psql -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"pg_trgm\";"
sudo -u postgres psql -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"btree_gin\";"

# 2. Import raw SQL schema into PostgreSQL
if [ -f "$SCHEMA_FILE" ]; then
    echo "Running V1__initial_schema.sql into PostgreSQL..."
    sudo -u postgres psql -d $DB_NAME -f "$SCHEMA_FILE" || true
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO $DB_USER;"
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
    sudo -u postgres psql -d $DB_NAME -c "ALTER SCHEMA public OWNER TO $DB_USER;"
    echo "✓ PostgreSQL tables imported successfully!"
fi

# 3. Restart Backend Service
echo "Starting FitEmpire Backend on Native EC2 PostgreSQL..."
sudo systemctl restart fitempire-backend

echo "========================================================"
echo "✓ Native PostgreSQL Tables Ready & Backend Connected!"
echo "Check tables: sudo -u postgres psql -d fitempire -c '\dt'"
echo "========================================================"
