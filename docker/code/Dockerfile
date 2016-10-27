FROM tomcat:7.0-jre7
ARG configuration=configuration/
ARG warfiles=warfiles/

WORKDIR /usr/local/tomcat/conf
COPY $configuration .

WORKDIR /usr/local/tomcat/webapps
RUN  rm -rf ROOT
COPY $warfiles .

WORKDIR /usr/local/tomcat/

