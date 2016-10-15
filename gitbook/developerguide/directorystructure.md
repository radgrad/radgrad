# Directory Structure

The RadGrad repository has the following top-level directory structure:

```
app/      # the application.
config/   # configuration files for deployment.
gitbook/  # sources for this documentation.
star/     # sample format for STAR data
```

The app/ directory layout is based on [meteor-application-template](http://ics-software-engineering.github.io/meteor-application-template/), which implements a set of conventions for file and directory naming and structure that conforms to suggestions from the [Meteor Guide](http://guide.meteor.com/structure.html).

Here is an overview of the app/ directory structure:

```
client/
  main.html
  main.js                      # import imports/startup/client
server/
  main.js                      # import imports/startup/server
imports/
  startup/
    client/
      index.js                 # load client startup code.
    server/
      index.js                 # load server startup code.
      fixtures.js              # initialize db on startup.
  api/                         # data model in this directory.
    opportunitytype/
      OpportunityTypeCollection.js
      OpportunityTypeCollection.test.js
    slug/
      SlugCollection.js
      SlugCollection.test.js
    etc...
```
