APP_NAME=workflow
APP_GROUP=backend
REPO=viruskizz/workflow-studio-management
COMMIT_ID=b46b9fef1819ce60a3dca031c57f2585831b24a1
aws deploy create-deployment \
  --application-name $APP_NAME \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --deployment-group-name $APP_GROUP \
  --description "My GitHub deployment demo" \
  --github-location repository=$REPO,commitId=$COMMIT_ID