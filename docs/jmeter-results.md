# Summary of JMeter Test Results

## Terminology
- Number of threads: analogous to the number of users
- Ramp up time: How long JMeter will take to start all of the threads.
- Target Requests Per Minute: How many requests JMeter makes per minute.
- Scheduled Runtime: How long the test plan runs for.

## Environment
JMeter 3.1 on Ubuntu Server 16 LTS run in non-gui mode.
The Item Viewer Service application is running in a docker container limited to 1024 CPU units and 950 MB of memory on a micro Amazon EC2 instance.
Each thread is configured to request either item 187-1437 or item 187-2889, and make the Ajax requests associated with loading the item.

## JMeter Requests vs Browser Requests
JMeter is not a browser.
It can measure request times and failures.
It will not execute JavaScript. It can not be used to measure page render time.

To simulate a browser request to the Item Viewer Service the test plan
requests the page, as well as performs the Ajax requests made when the page loads.
This provides a simulation of the requests a browser would make.

## Running the test plan
To run a test plan you can use `jmeter -n -t ItemViewerTestPlan.jmx -l testresults.csv`

To generate results `jmeter -g testresults.csv -o ResultsView`

## Interpreting Results

Average response time is the average for the load item transaction controllers.

## Results

| Number of Threads | Ramp-up-time (s) | Target Requests Per Minute | Scheduled Runtime (s) | Avg Response Time (ms) | Error Rate |
|-------------------|------------------|----------------------------|-----------------------|------------------------|------------|
| 100               | 100              | 100                        | 580                   | 1222                   | 0%         |
| 200               | 100              | 200                        | 580                   | 1557                   | 0%         |
| 300               | 100              | 300                        | 580                   | 1894                   | 0%         |
