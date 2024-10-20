#!/bin/bash
DIR=/home/admin/workflow-backend

cd $DIR
sudo npm install
cp /home/admin/.env.workflow .env
npm run build