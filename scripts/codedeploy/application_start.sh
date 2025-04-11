#!/bin/bash
source variable.sh

# Start Backend
BACKEND_DIR=$CODEDEPLOY_PROJECT_DIR/$BACKEND_DIR
pm2 start $BACKEND_DIR/dist/main.js -n $PM2_BACKEND_NAME


# Start Frontend
# FRONTEND_DIR=$CODEDEPLOY_PROJECT_DIR/$FRONTEND_DIR
# pm2 start $FRONTEND_DIR/dist/main.js -n $PM2_FRONTEND_NAME