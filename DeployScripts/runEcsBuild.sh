#!/bin/bash
set -ev

if [ "$BRANCH" == "dev" ]; then
    aws ecs run-task --region us-west-2 --cluster SampleBuilder --count 1 --task-definition ItemViewerServiceBuilder-dev
fi

if [ "$BRANCH" == "master" ]; then
    aws ecs run-task --region us-west-2 --cluster SampleBuilder --count 1 --task-definition ItemViewerServiceBuilder-prod
fi
