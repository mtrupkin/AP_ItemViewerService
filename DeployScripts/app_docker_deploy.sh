#!/bin/bash
set -ev

cd docker/
mkdir content
wget -q "$CONTENT_PACKAGE_URL" -O content.zip
unzip -o content.zip -d content/ &> /dev/null
rm content.zip 
docker build -t itemviewerserviceapp .
docker tag itemviewerserviceapp:latest osucass/itemviewerserviceapp:$BRANCH
docker push osucass/itemviewerserviceapp:$BRANCH
