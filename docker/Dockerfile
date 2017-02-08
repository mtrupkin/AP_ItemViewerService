FROM 047189625337.dkr.ecr.us-west-2.amazonaws.com/smarterbalancedtomcatdocker

WORKDIR /usr/local/tomcat/webapps
RUN  rm -rf ROOT
COPY itemviewerservice.war .

RUN mv itemviewerservice.war ROOT.war

WORKDIR /usr/local/tomcat/

ENTRYPOINT ["catalina.sh", "run"]