#!/usr/bin/env bash

# REQUIRES ENV VARS:
# ENV_PATH             e.g. /tmp/store-front-production
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_DEFAULT_REGION    e.g. eu-west-1
# ECR_BUILD_IMAGE_TAG   e.g. store-front-production
# API_ROOT
# CURATION_ROOT
# S3_ROOT
# IDP_MEMBERS


virtualenv $ENV_PATH
source $ENV_PATH/bin/activate
pip install awscli

sudo `aws ecr get-login --no-include-email --region ${AWS_DEFAULT_REGION}`

sudo docker build -t ${ECR_BUILD_IMAGE_TAG} \
--build-arg API_ROOT=${API_ROOT} \
--build-arg CURATION_ROOT=${CURATION_ROOT} \
--build-arg S3_ROOT=${S3_ROOT} \
--build-arg IDP_MEMBERS=${IDP_MEMBERS} \
--compress \
.
