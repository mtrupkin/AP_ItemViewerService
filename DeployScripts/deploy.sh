#!/bin/bash
set -ev

ServiceName=$1
ClusterName=$2

cd /home/travis/build/osu-cass/AP_ItemViewerService/docker/
mkdir content
wget "$CONTENT_PACKAGE_URL" -O content.zip
unzip -o content.zip -d content/ &> /dev/null
rm content.zip 
docker build -t itemviewerserviceapp .
docker tag itemviewerserviceapp:latest osucass/itemviewerserviceapp:$BRANCH
docker push osucass/itemviewerserviceapp:$BRANCH
ecs deploy $ClusterName $ServiceName --region $Region