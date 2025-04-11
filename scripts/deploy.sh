APP_NAME=workflow
APP_GROUP=onpremise
REPO=viruskizz/workflow-studio-management
COMMIT_ID=$1
aws deploy create-deployment \
  --application-name $APP_NAME \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --deployment-group-name $APP_GROUP \
  --file-exists-behavior OVERWRITE\
  --description "My GitHub deployment demo" \
  --github-location repository=$REPO,commitId=$COMMIT_ID