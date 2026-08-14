#!/bin/bash
# ==============================================================================
# FitEmpire - AWS EC2 Automated Initialization Script
# ==============================================================================

set -e

echo "========================================================"
echo "Starting FitEmpire EC2 Host Provisioning..."
echo "========================================================"

# 1. Setup 2GB Swap Space (Crucial for t3.micro 1GB RAM)
if [ ! -f /swapfile ]; then
    echo "Creating 2GB Swap memory to prevent Out-Of-Memory errors..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✓ 2GB Swap memory configured successfully!"
fi

# 2. Update and Install packages non-interactively
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y
sudo apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" \
    curl \
    git \
    nginx \
    openjdk-21-jdk \
    maven \
    htop \
    unzip

echo "========================================================"
echo "✓ Packages Installed Successfully!"
echo "Java Version: $(java -version 2>&1 | head -n 1)"
echo "Maven Version: $(mvn -v 2>&1 | head -n 1)"
echo "========================================================"
