#!/bin/bash
set -ev

cd /home/travis/build/osu-cass/AP_ItemViewerService/docker/
docker build -f Dockerfile.code -t itemviewerservice .
docker tag itemviewerservice:latest osucass/itemviewerservicecode:$BRANCH
docker push osucass/itemviewerservicecode:$BRANCH