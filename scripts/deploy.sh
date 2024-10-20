APP_NAME=workflow
APP_GROUP=backend
REPO=viruskizz/workflow-studio-management
COMMIT_ID=8da391fbf6db048bb258154042d4a6e72d9eae0f
aws deploy create-deployment \
  --application-name $APP_NAME \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --deployment-group-name $APP_GROUP \
  --file-exists-behavior OVERWRITE\
  --description "My GitHub deployment demo" \
  --github-location repository=$REPO,commitId=$COMMIT_ID