#!/bin/bash
set -ev

cd docker/
docker build -f Dockerfile.code -t itemviewerservice .
docker tag itemviewerservice:latest osucass/itemviewerservicecode:$BRANCH
docker push osucass/itemviewerservicecode:$BRANCH