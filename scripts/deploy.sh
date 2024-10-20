APP_NAME=workflow
APP_GROUP=workflow-backend
REPO=viruskizz/workflow-studio-management
COMMIT_ID=e0ea3d0128c1b26d5bdf28440d66087b7de71f3b
aws deploy create-deployment \
  --application-name $APP_NAME \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --deployment-group-name $APP_GROUP \
  --description "My GitHub deployment demo" \
  --github-location repository=$REPO,commitId=$COMMIT_ID