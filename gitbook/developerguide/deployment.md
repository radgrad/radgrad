# Deployment

Currently, there is only one deployment of RadGrad: the "ICS deployment". RadGrad is intended to support separate deployments for each academic unit. It is possible for each academic unit to choose its own deployment approach.

### ICS Deployment Approach

The ICS Deployment is available at: [https://radgrad.ics.hawaii.edu](https://radgrad.ics.hawaii.edu).

The ICS deployment is hosted at [Galaxy](https://www.meteor.com/hosting), a Meteor-specific hosting service. We chose Galaxy for the ICS deployment because:

  * To our knowledge, Galaxy does the best job of eliminating "devops" overhead on development. We find Galaxy-based deployment to be extremely simple and reliable.
  * Galaxy provides SSL (https) automatically. SSL configuration can be complex and time-consuming.
  
The MongoDB instance for the ICS Deployment is hosted at [MLab](https://mlab.com/).