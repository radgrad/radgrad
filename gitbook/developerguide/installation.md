# Installation

First, download and install [Meteor](https://www.meteor.com/). 

Second, download the RadGrad source code from [https://github.com/radgrad/radgrad](https://github.com/radgrad/radgrad).

Next, cd to the radgrad/app/ directory and invoke npm:

```
app$ npm install
```

This will download and install the third-party libraries required to run this system.

To make sure the database starts from an empty state, run:

```
app$ meteor reset
```

To run the system, invoke this command:

```
app$ meteor npm run start
```

Go to [http://localhost:3000](http://localhost:3000) to confirm that the system is running:


<img src="images/home-page.png" width="100%">