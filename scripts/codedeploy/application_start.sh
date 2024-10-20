#!/bin/bash
DIR=/home/admin/workflow-backend
pm2 start $DIR/dist/main.js -n workflow