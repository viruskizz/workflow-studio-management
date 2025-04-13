#!/bin/bash
source $(dirname $0)/variable.sh

# Start Backend
BACKEND_DIR=$PROJECT_DIR/$BACKEND_DIR
pm2 start $BACKEND_DIR/dist/main.js -n $PM2_BACKEND_NAME


# Start Frontend
FRONTEND_DIR=$PROJECT_DIR/$FRONTEND_DIR
cd $FRONTEND_DIR
pm2 serve dist/apollo-ng 4200 -n $PM2_FRONTEND_NAME