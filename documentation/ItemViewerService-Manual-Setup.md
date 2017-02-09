# Item Viewer Service Manual Setup
To build and run the item viewer service on your local machine you will need the following.

## Dependencies
### Compile Time Dependencies
Compile time dependencies are built into the Maven POM file.
Java 7 is required to build and run the Item Viewer Service.

The Item Viewer Service depends on the Iris package of TDS_Student.

### Run Time Dependencies
- Apache Tomcat 7 or newer
- Smarter Balanced Dictionary API access
- Read access to the local file system


## Configuration
The item viewer service configuration file is located at `app/src/main/resources/settings-mysql.xml`.

The `iris.ContentPath` variable in the settings-mysql.xml file needs to be set to the local directory where the content packages are going to be stored. 
If this directory does not exist, or the application can not access it, it will fail to launch.


Iris requires a 25 character alphanumeric numeric encryption key set as a parameter in $TOMCAT_HOME/conf/context.xml under the context element.
The entry follows the form `<Parameter value="YOUR KEY ENCRYPTION KEY HERE" override="false" name="tds.iris.EncryptionKey"/>`.

### Dictionary API
In order to use the dictionary you need to set the `iris.DictionaryUrl` value in the settings-mysql.xml config file for the Iris.
The dictionary should be a running instance of the [TDS_Dictionary application](https://github.com/SmarterApp/TDS_Dictionary).

The dictionary API call is made as a cross origin request. A CORS filter needs to be added to the Tomcat `$TOMCAT_HOME/conf/web.xml file`.

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

Tomcat has detailed [documentation](http://tomcat.apache.org/tomcat-8.0-doc/config/filter.html#CORS_Filter) on setting up CORS filtering. Please refer to it if you want to  set up a more detailed filter.

### Aws Container Cluster Information (Optional)
The "AwsRegion" and "AwsClusterName" keys are used if the application is being run outside of an AWS ERS cluster. 
If you are running the Item Viewer locally you can ignore these.
Please note that the /status url will not work if the Item Viewer is being run outside of an AWS ECS cluster. 
Use /statusLocal for local diagnostics.

### Logging
The item viewer service uses [SLF4J](http://www.slf4j.org/) bound to [Logback Classic](http://logback.qos.ch/) for logging. The log settings are found in logback.xml. For basic logging to a file you will need to set the file location for the file appender. For a full reference on configuring the log output levels and locations please refer to the Logback Classic [documentation](http://logback.qos.ch/manual/configuration.html).

### Local System
The application requires read permissions to the Iris content directory specified in settings-mysql.xml.

## Building and Running
### Building
To build the item viewer run `mvn install` in the top level project directory. 
The compiled WAR file will be generated in `app/target/itemviwerservice.war`.

### Running Locally
Deploy the WAR file to Apache Tomcat by placing the itemviewerservice.war file in your tomcat webapps directory. Restart Tomcat.

### Running on an EC2 Instance
If you are running the Item Viewer in an EC2 instance you will need to configure it to 

#### AWS Prerequisites
- Create a security group to allow access to certain ports:

##### Inbound
| Type | Protocol | Port Range | Source |
| --- | --- | --- | --- |
|HTTP | TCP | 80 | 0.0.0.0/0 |
| SSH | TCP | 22 | 0.0.0.0/0 |

##### Outbound
| Type | Protocol | Port Range | Source |
| --- | --- | --- | --- |    
| All Traffic | All | All | 0.0.0.0/0 |

#### AWS Setup
Launch an Amazon Web Services instance with the following configurations:

1. Use AMI: Ubuntu Server 14.04 LTS (HVM), SSD Volume Type (ami-d732f0b7).
2. Select a suitable instance size.
3. Select `Next: Configure Instance Details`
4. Add the IAM role that grants S3 bucket access
5. Select ```Review and Launch```.
6. Next to ```Security Groups```, select ```Edit Security Groups``` and add the security group created in the __Prerequisites__ section.
7. Launch your instance.

#### Dependency Installation
In the AWS instance launched, update packages:
`apt-get update`

- Install openjdk-7:
`apt-get install openjdk-7-jdk`

- Install tomcat7 and tomcat7-admin:
`apt-get install tomcat7 tomcat7-admin`

- Install nginx for port forwarding:
`apt-get install nginx`

### Installation
After the AWS instance launches:
- Update packages: 
`apt-get update`

- Install openjdk-7:
`apt-get install openjdk-7-jdk`

- Install tomcat7 and tomcat7-admin:
`apt-get install tomcat7 tomcat7-admin`

- Install nginx for port forwarding:
`apt-get install nginx`

### Tomcat Configuration
- Create a directory for tomcat give it permissions:
```
mkdir -p /home/tomcat7/content
chown -R tomcat7:tomcat7 /home/tomcat7
chown -R tomcat7:tomcat7 /usr/share/tomcat7
```

- Update the tomcat configuration files as mentioned above by adding the following to ```/etc/tomcat7/web.xml```:
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

### Configure nginx
Replace ```/etc/nginx/sites-available/default``` with the following text (requires root permissions):
```
server {
    listen 80;
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Launch Application
Restart tomcat7 and nginx:

`sudo service tomcat7 restart`

`sudo service nginx restart`