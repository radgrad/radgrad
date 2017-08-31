# Continuous integration

We use Semaphore CI for [RadGrad Continuous Integration](https://semaphoreci.com/radgrad/radgrad). Each time someone commits to the [master branch of the RadGrad datamodel GitHub repo](https://github.com/radgrad/datamodel), Semaphore will clone this branch, install Meteor, invoke both unit and integration tests, and build the JSDocs. 

Here is an example build and run of the system:

<img src="images/radgrad-semaphore-build-example.png" width="100%">

Current build status: 

[![Build Status](https://semaphoreci.com/api/v1/radgrad/radgrad/branches/master/badge.svg)](https://semaphoreci.com/radgrad/radgrad) 
