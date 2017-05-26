# Directory Structure

The RadGrad repository has the following top-level directory structure:

```
app/      # the application.
config/   # configuration files for deployment.
gitbook/  # sources for this documentation.
```

The app/ directory layout is based on [meteor-application-template](http://ics-software-engineering.github.io/meteor-application-template/), which implements a set of conventions for file and directory naming and structure that conforms to suggestions from the [Meteor Guide](http://guide.meteor.com/structure.html).

Here is an overview of the app/ directory top-level structure:

```
client/              # load all client-side code from imports dir.             
server/              # load all server-side code from imports dir.
imports/
  startup/           # startup code for client and server side.
  api/               # the data model.
  ui/
    layouts/         # top-level ui layouts, generally organized by role. 
    pages/           # top-level pages within one or more layouts.
    components/      # components reside within a page and can be shared between pages.
```
