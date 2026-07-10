#!/bin/bash

echo "Cleaning up ports (8080, 3000, 8081, 8082)..."

kill_port() {
  PORT=$1
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    PID=$(netstat -ano | findstr :$PORT | awk '{print $5}' | uniq)
    if [ ! -z "$PID" ]; then
      for p in $PID; do
        if [ "$p" != "0" ]; then
          echo "Killing process $p on port $PORT..."
          taskkill //PID $p //F > /dev/null 2>&1
        fi
      done
    fi
  else
    # Linux/Mac
    PID=$(lsof -ti :$PORT)
    if [ ! -z "$PID" ]; then
      echo "Killing process $PID on port $PORT..."
      kill -9 $PID
    fi
  fi
}

kill_port 8080
kill_port 3000
kill_port 8081
kill_port 8082

echo "Starting Backend on port 8080..."
cd fitempire-backend
# Run in background
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"
cd ..

echo "Starting Admin Portal on port 3000..."
cd fitempire-admin
npm run dev > admin.log 2>&1 &
ADMIN_PID=$!
echo "Admin Portal started with PID $ADMIN_PID"
cd ..

echo "Starting Mobile App on port 8081..."
cd fitempire-mobile
# Fix for 'unable to get local issuer certificate' error in Expo
export NODE_TLS_REJECT_UNAUTHORIZED=0
export EXPO_NO_TELEMETRY=1
npx expo start > mobile.log 2>&1 &
MOBILE_PID=$!
echo "Mobile App started with PID $MOBILE_PID"
cd ..

echo "All services started!"
echo "Check backend.log, fitempire-admin/admin.log, and fitempire-mobile/mobile.log for output."
