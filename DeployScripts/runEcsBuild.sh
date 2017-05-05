#!/bin/bash
set -ev

#Do nothing if this is a pull request.
# Pull request is either false, or the PR number if it is a PR.
if [[ ! ( "$TRAVIS_PULL_REQUEST" == "false" ) ]]; then exit 0; fi

Region="us-west-2"
aws ecr get-login --region $Region | source /dev/stdin

if ( [ "$BRANCH" == "feature_travis-docker" ] || [ "$BRANCH" == "dev" ] || [ "$BRANCH" == "master" ] ) && [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
    ServiceName="ItemViewerService-dev"
    if [ "$BRANCH" == "dev" ]
    then
        ServiceName="ItemViewerService-dev"
        ClusterName="ItemViewerService-prod"
    elif [ "$BRANCH" == "master" ]
    then
        ServiceName="ItemViewerService-prod"
        ClusterName="ItemViewerService-prod"
    elif [ "$BRANCH" == "feature_travis-docker" ]  # For testing
    then
        ServiceName="ItemViewerService-dev"
        ClusterName="ItemViewerService-prod"
    fi

    cd /home/travis/build/osu-cass/docker/
    mkdir content
    wget https://s3-us-west-2.amazonaws.com/cass-sb-itemviewerservice-content/content.zip
    unzip -o content.zip -d content/ &> /dev/null
    rm content.zip 
    docker build -t itemviewerserviceapp .
    docker tag itemviewerserviceapp:latest osucass/itemviewerserviceapp:$BRANCH
    docker push osucass/itemviewerserviceapp:$BRANCH
    ecs deploy $ClusterName $ServiceName --region $Region
fi