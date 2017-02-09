Configuration

## Item Viewer Configuration
### General
The Item Viewer Service config file is located in `app/src/main/resources/settings-mysql.xml`
Most of the vlaues are carried over from Iris.
The following options must be configured in the settings-mysql.xml config file for the Item Viewer to function correctly.
- `iris.ContentPath` must be set to the location of the content package on the local filesystem.
- `iris.DictionaryUrl` must be set to the url of the [dictionary API](https://github.com/SmarterApp/TDS_Dictionary).
- `AwsRegion` Set this to the AWS region the Ite Viewer is running in if it is running on AWS.
- `AwsClusterName` Set this to the AWS ECS cluster the Item Viewer Service is running in if it is running on AWS ECS.

### Logging
The Item viewer service uses Logback Classic bound to SLF4J for logging.
The Logging configuration file is `app/src/main/resources/logback.xml`.
The config file included will log to stdout and `/home/tomcat7/itemviewerservice.log`.
Details for configuring the log output can be found in the loback classic [documentation](https://logback.qos.ch/manual/configuration.html).

## Tomcat
The Item Viewer must be run in Apache Tomcat 7 or newer.

In order to run correctly the following Tomcat configuration needs to be set.

Set a 25 character alphanumeric numeric encryption key for Iris in $TOMCAT_HOME/conf/context.xml under the context element.
The entry follows the form `<Parameter value="YOUR KEY ENCRYPTION KEY HERE" override="false" name="tds.iris.EncryptionKey"/>`.

The dictionary API call is made as a cross origin request. A CORS filter must be added to `$TOMCAT_HOME/conf/web.xml`.

```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```