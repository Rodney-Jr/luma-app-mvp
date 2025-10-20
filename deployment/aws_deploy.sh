#!/bin/bash
set -e

# Simple bootstrap script for EC2 (assumes docker & docker-compose installed)
# Usage: run on EC2 after git clone into /home/ec2-user/luma-mvp

REPO_DIR="${1:-/home/ubuntu/luma-mvp}"
cd "$REPO_DIR" || exit 1

echo "Pulling latest images from GHCR..."
docker-compose -f deployment/docker-compose.yml pull || true

echo "Starting stack..."
docker-compose -f deployment/docker-compose.yml up -d --remove-orphans --build

echo "Done. Services:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
#echo "To view logs: docker-compose -f deployment/docker-compose.yml logs -f"
#echo "To stop services: docker-compose -f deployment/docker-compose.yml down"