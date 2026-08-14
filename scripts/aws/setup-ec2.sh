#!/bin/bash
# ==============================================================================
# FitEmpire - AWS EC2 Initialization Script
# ==============================================================================
# Supports: Ubuntu 22.04 / 24.04 LTS or Amazon Linux 2023
# Usage:
#   ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
#   curl -fsSL https://raw.githubusercontent.com/ayushgupta9906/FitEmpire/main/scripts/aws/setup-ec2.sh | bash
# ==============================================================================

set -e

echo "========================================================"
echo "Starting FitEmpire EC2 Host Provisioning..."
echo "========================================================"

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
fi

echo "Detected OS: $OS"

if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    export DEBIAN_FRONTEND=noninteractive
    sudo apt-get update -y
    sudo apt-get upgrade -y
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        ufw \
        nginx \
        openjdk-21-jdk \
        maven \
        htop \
        unzip

    # Install Docker
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        sudo systemctl enable docker
        sudo systemctl start docker
        rm -f get-docker.sh
    fi

    # Install Docker Compose Plugin
    sudo apt-get install -y docker-compose-plugin

    # Configure Firewall
    sudo ufw allow OpenSSH
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 8080/tcp
    sudo ufw --force enable

elif [ "$OS" = "amzn" ] || [ "$OS" = "fedora" ] || [ "$OS" = "rhel" ]; then
    sudo dnf update -y
    sudo dnf install -y git docker nginx java-21-amazon-corretto maven htop
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
fi

echo "========================================================"
echo "✓ EC2 Host Environment Configured!"
echo "Docker Version: $(docker --version 2>/dev/null || echo 'Re-login for docker')"
echo "Java Version:   $(java -version 2>&1 | head -n 1)"
echo "========================================================"
