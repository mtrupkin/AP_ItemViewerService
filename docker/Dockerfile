FROM osucass/sbtomcat

ARG source=content/
ARG contentStore=/home/tomcat7/content/
COPY $source $contentStore

WORKDIR /usr/local/tomcat/webapps
RUN  rm -rf ROOT
COPY itemviewerservice.war .

RUN mv itemviewerservice.war ROOT.war

WORKDIR /usr/local/tomcat/

ENTRYPOINT ["catalina.sh", "run"]