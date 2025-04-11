#!/bin/bash
source $(dirname $0)/variable.sh

# Configure .env
cd $CODEDEPLOY_PROJECT_DIR
cp /home/admin/.env.workflow .env

# Backend Configuration
cd $CODEDEPLOY_PROJECT_DIR/$BACKEND_DIR
cp ../.env .env
npm install
# npm run build

# Frontend Configuration
cd $CODEDEPLOY_PROJECT_DIR/$FRONTEND_DIR
cp ../.env .env
npm install
# npm run build