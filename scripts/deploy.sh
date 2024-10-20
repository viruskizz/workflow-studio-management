APP_NAME=workflow
APP_GROUP=backend
REPO=viruskizz/workflow-studio-management
COMMIT_ID=3b78ea3e5bd10d0af625148e5f8c4ac406416117
aws deploy create-deployment \
  --application-name $APP_NAME \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --deployment-group-name $APP_GROUP \
  --file-exists-behavior OVERWRITE\
  --description "My GitHub deployment demo" \
  --github-location repository=$REPO,commitId=$COMMIT_ID