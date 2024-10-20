APP_NAME=workflow
APP_GROUP=backend
REPO=viruskizz/workflow-studio-management
COMMIT_ID=229c7888c16fe3daa84147d0f4a0dd8f68f942d9
aws deploy create-deployment \
  --application-name $APP_NAME \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --deployment-group-name $APP_GROUP \
  --file-exists-behavior OVERWRITE\
  --description "My GitHub deployment demo" \
  --github-location repository=$REPO,commitId=$COMMIT_ID