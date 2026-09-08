# AWS ECS Fargate Deployment Architecture

## Overview
FitEmpire production infrastructure runs on AWS ECS Fargate with Neon Serverless PostgreSQL.

## Architecture Topology
- **VPC**: 2 Public Subnets, 2 Private Subnets across `ap-south-1a` and `ap-south-1b` (Mumbai).
- **ALB**: Application Load Balancer with ACM SSL certificate (*.fitempire.tech).
- **ECS Task**: 2 vCPU, 4GB RAM with autoscaling (min 2, max 10 tasks).
- **Database**: Neon Serverless PostgreSQL with pooling via PgBouncer.

## Deployment Command
```bash
# Build and tag image
docker build -t fitempire-backend:latest .
docker tag fitempire-backend:latest 123456789.dkr.ecr.ap-south-1.amazonaws.com/fitempire:latest

# Push to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.ap-south-1.amazonaws.com
docker push 123456789.dkr.ecr.ap-south-1.amazonaws.com/fitempire:latest

# Force new ECS deployment
aws ecs update-service --cluster fitempire-prod --service api --force-new-deployment
```
