#!/usr/bin/env bash

sudo docker rmi $(docker images |grep 'store-front')
sudo rm ci-scripts/container-definitions.json
sudo rm -r $ENV_PATH
