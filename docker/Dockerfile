FROM tomcat:8.0.45-jre7
ARG source=content/
ARG contentStore=/home/tomcat7/content/

COPY context.xml /usr/local/tomcat/conf

COPY $source $contentStore

WORKDIR /usr/local/tomcat/webapps
RUN  rm -rf ROOT
COPY itemviewerservice.war .

RUN mv itemviewerservice.war ROOT.war

WORKDIR /usr/local/tomcat/

ENTRYPOINT ["catalina.sh", "run"]