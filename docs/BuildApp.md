
# Build
Item Viewer Service API requires content before running. 

There is a two-step process using docker. The base app without content needs 
to be created as a docker image called code. Then we combine the code image 
with the content package using another dockerfile. 

## Before starting build
Locate the dockerfile.stage and dockerfile.prod files
from github repo, navigate to deployScripts

## Using a previous docker code image

### Docker
1. Navigate to directory containing dockerfiles
2. Get docker code repo for stage/prod, run `docker pull reponame:{tag}`
    1. Example stage: run `docker pull xxx.dkr.ecr.us-west-2.amazonaws.com/itemviewerservicecode:stage`
    2. Example producation: run `docker pull xxx.dkr.ecr.us-west-2.amazonaws.com/itemviewerservicecode:prod`
3. Docker tag code, run `docker tag reponame:{tag} itemviewerservicecode:{tag}`
    1. Example stage: run `docker tag xxx.dkr.ecr.us-west-2.amazonaws.com/itemviewerservicecode:stage itemviewerservicecode:stage`
    2. Example production: run `docker pull xxx.dkr.ecr.us-west-2.amazonaws.com/itemviewerservicecode:prod itemviewerservicecode:prod`
4. place content within dockerfile directory
    1. Content needs to be unzipped
    2. content directory root level needs Items directory
5. Docker build, run `docker build -t itemviewerserviceapp:{tag} -f Dockerfile.{tag} .`
    1. Example stage: run `docker build -t itemviewerserviceapp:stage -f Dockerfile.stage .`
    2. Example production: run `docker build -t itemviewerserviceapp:prod -f Dockerfile.prod .`
6. Docker Run app , run `docker exec -it -p 8012:8080 itemviewerserviceapp:{tag}`
    1. Example stage: run `docker exec -it -p 8012:8080 itemviewerserviceapp:stage`
    2. Example production: run `docker exec -it -p 8012:8080 itemviewerserviceapp:prod`
7. Go to [localhost:8012](http://localhost:8012)


## Deploy Item Viewer Service app
1. see [Publish Docker](#publish-docker-to-aws)