#!/usr/bin/env bash

# REQUIRES ENV VARS:
# BRANCH_NAME              e.g. staging
# ECR_REPOSITORY_NAME      e.g. store-front-staging
# ECS_CLUSTER_NAME         e.g. store-front-staging-ecs
# ECS_SERVICE_NAME         e.g. store-staging-store-front-web-service
# ECS_TASK_DEFINITION_NAME e.g. store-staging-store-front-web-tas
# CONTAINER_NAME           e.g. store-front-web
# API_ROOT                 e.g. http://staging-store-api-web-elb-1675125256.eu-west-1.elb.amazonaws.com:80/
# CURATION_ROOT            e.g. http://staging-curation-web-elb-1677030901.eu-west-1.elb.amazonaws.com:80
# IDP_MEMBERS              e.g. https://microservice.data.alpha.jisc.ac.uk:1337/idps
# S3_ROOT                  e.g. https://s3-eu-west-1.amazonaws.com/jisc-store-content/
# AWS_LOGS_GROUP
# AWS_LOGS_REGION

source $ENV_PATH/bin/activate

COMMIT_ID=`git rev-list --branches ${BRANCH_NAME} --max-count=1`

echo "Commit ID is ${COMMIT_ID}"

# The recently build image will be tagged as store-front-{environment}:latest
ECR_LOCAL_TAG="${ECR_REPOSITORY_NAME}:latest"

# Tag the image with the COMMIT_ID
ECR_REMOTE_TAG="${ECR_REPOSITORY_NAME}:${COMMIT_ID}"
ECR_IMAGE_URL="684381864438.dkr.ecr.eu-west-1.amazonaws.com/${ECR_REMOTE_TAG}"
sudo docker tag ${ECR_LOCAL_TAG} ${ECR_IMAGE_URL}

echo "Pushing docker image to ECR"

# Push the image up to ECR
sudo docker push ${ECR_IMAGE_URL}

# TODO - Its quite messy to have to create a new container definition that may be different to terraform
# See if there is an alternative method of creating a revision on an existing task definition
# Prepare the new container definition
NEW_CONTAINER_DEFINITION=`sed \
-e 's@${CONTAINER_NAME}@'"${CONTAINER_NAME}"'@' \
-e 's@${ECR_IMAGE_URL}@'"${ECR_IMAGE_URL}"'@' \
-e 's@${API_ROOT}@'"${API_ROOT}"'@' \
-e 's@${CURATION_ROOT}@'"${CURATION_ROOT}"'@' \
-e 's@${IDP_MEMBERS}@'"${IDP_MEMBERS}"'@' \
-e 's@${S3_ROOT}@'"${S3_ROOT}"'@' \
-e 's@${AWS_LOGS_GROUP}@'"${AWS_LOGS_GROUP}"'@' \
-e 's@${AWS_LOGS_REGION}@'"${AWS_LOGS_REGION}"'@' \
ci-scripts/container-definitions-template.json`

# Write container definition to file
echo ${NEW_CONTAINER_DEFINITION} > ci-scripts/container-definitions.json

echo "Registering new task definition - ${ECS_TASK_DEFINITION_NAME}"

# Register a new task definition, using the container definition file that has just been created
aws ecs register-task-definition --family ${ECS_TASK_DEFINITION_NAME} --cli-input-json file://ci-scripts/container-definitions.json

echo "Updating cluster service - cluster: ${ECS_CLUSTER_NAME}, service: ${ECS_SERVICE_NAME}"

# Update the service within the cluster to use the new task definition
aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --task-definition ${ECS_TASK_DEFINITION_NAME}