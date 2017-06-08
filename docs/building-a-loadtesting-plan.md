# Load Testing the Item Viewer Service
This document describes load testing the Item Viewer Service using [Apache JMeter](http://jmeter.apache.org/).

### Important Load Test Factors
JMeter is not a browser.
It can measure request times and failures.
It will not execute JavaScript. It can not be used to measure page render time.


To simulate a browser request to the Item Viewer Service the test plan
must request the page, as well as perform the Ajax requests made when the page loads.
When an item is loaded with the Item Viewer Service the service loads the JavaScript frontend
and makes an Ajax request to the Iris API to load the XML for the item. 


### Building a Test Plan
To mimic a browser requesting an item the test plan must be set up with
an HTTP cache manager, and an HTTP cookie manager.
A test plan that includes these parts is located in the Item Viewer Service git repository.

#### Thread Group
The thread group is the simulated users of the application.
Adjusting the number of threads is analogous to adjusting the number of users.
Each thread can be set to loop a specific number of times which is analogous to sequential actions taken by a user.

#### HTTP Request Defaults
The HTTP request defaults must specify the base URL for the item viewer service.
In the advanced options the HTTP request defaults must retrieve all embedded resources.

#### Transaction Controller
A transaction controller should be added to aggregate the time taken to load the item page,
and perform the Ajax request for the item xml.

Under the transaction controller two HTTP requests should be specified.
One for the page load, and one for the Ajax post request. 

##### Item Request
An HTTP request must be set up to request the item page at `/item/BANK-KEY`.
Replace "BANK" and "KEY" with the bank and key for a valid item.
No parameters or body data needs to be specified.

##### Item XML Ajax POST Request
An HTTP POST request must be set up to mimic the Ajax post request for an item XML.
The path must be set to `/Pages/API/content/load`.
The method must be set to "POST".
The body data must be set using the following format.
```JSON
{"items":[{"response":"","id":"I-BANK-KEY"}],"accommodations":[]}
```
Replace "BANK" and "KEY" with the bank and key for a valid item.