#!/bin/bash
source variable.sh

pm2 delete $PM2_FRONTEND_NAME
pm2 delete $PM2_BACKEND_NAME