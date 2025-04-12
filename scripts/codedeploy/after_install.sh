#!/bin/bash
source $(dirname $0)/variable.sh

# Backend Configuration
cd $PROJECT_DIR/$BACKEND_DIR
cp $WORKING_DIR/.env.workflow .env
npm install
npm run build

# Frontend Configuration
cd $PROJECT_DIR/$FRONTEND_DIR
npm install
ng g environments
cp  $WORKING_DIR/.environment.workflow.ts src/environments/environment.development.ts
cp  $WORKING_DIR/.environment.workflow.ts src/environments/environment.ts
