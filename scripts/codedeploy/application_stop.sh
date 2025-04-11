#!/bin/bash
source $(dirname $0)/variable.sh

echo "PM2_FRONTEND_NAME=$PM2_FRONTEND_NAME"
if [ ! -z "$(pm2 pid $PM2_FRONTEND_NAME)" ]; then
    pm2 pid $PM2_FRONTEND_NAME
    pm2 delete $PM2_FRONTEND_NAME
fi

echo "PM2_BACKEND_NAME=$PM2_BACKEND_NAME"
if [ ! -z "$(pm2 pid $PM2_BACKEND_NAME)" ]; then
    pm2 pid $PM2_BACKEND_NAME
    pm2 delete $PM2_BACKEND_NAME
fi