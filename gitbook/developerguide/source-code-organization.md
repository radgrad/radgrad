# Source code organization

The RadGrad repository has the following top-level directories:

```
radgrad/
       app/      # the application.
       archive/  # for material we're not quite ready to delete yet.
       config/   # configuration files for deployment.
       gitbook/  # sources for this documentation.
```

Of these, the only directory with a complex substructure is app/. Let's look at that one:

## radgrad/app/

The radgrad/app/ directory layout is based on [meteor-application-template](http://ics-software-engineering.github.io/meteor-application-template/), which implements a set of conventions for file and directory naming and structure that conforms to suggestions from the Meteor Guide chapter on [Application Structure](http://guide.meteor.com/structure.html). 

The most important organizational concept is that almost all of the application code is placed inside the imports/ directory, and the code inside the client/ and server/ directories are responsible for loading the code for the client and server sides, respectively.

Here are the top-level directories in the app/ directory:

```
app/
   client/    # responsible for loading all client-side code from imports dir.             
   imports/   # implementation code lives here.
   private/   # contains database fixtures. "private" means not accessible via URL.
   public/    # contains images and semantic ui theme files. "public" means accessible via URL.
   server/    # responsible for loading all server-side code from imports dir.
```
Of these directories, the only directory with a complex substructure is imports/.  Let's now look at that one:

## radgrad/app/imports

The imports/ directory contains three subdirectories:

```
imports/
       api/        # data model implementation
       startup/    # system startup
       ui/         # client-side user interface code
```

Let's look at each in turn.

## radgrad/app/imports/api

The api/ subdirectory provides the code for the RadGrad "data model". This code is generally loaded on both the client and server sides of the application.  See the Data Model section of this manual for detailed information on the data model. In this section, we will just briefly introduce the source organization.

```
api/ 
   base/         # Superclasses for collection classes.
   career/       # Career goal code.
   course/       # Course and course instance code.
   degree-plan/  # Degree plan code.
   feed/         # Code for the RadGrad "feed" widget.
   feedback/     # Implementation of the Feedback (recommendation) facilities
   help/         # RadGrad's page-level help system.
   ice/          # Support for the ICE game mechanic
   integrity/    # Code to ensure that the database is in a consistent state
   interest/     # Interest code.
   level/        # Implementation of RadGrad levels.
   log/          # Code for logging user behavior.
   mentor/       # Implement the Mentor Space questions and answers.
   opportunity/  # Opportunity and opportunity instance code.
   public-stats/ # Data that appears on landing page; login not required to see.
   radgrad/      # Provides meta-data about set of collections and so forth.
   review/       # Implement course and opportunity reviews.
   role/         # Support for roles: student, faculty, advisor, mentor, admin 
   semester/     # Semester representation code.
   slug/         # Slug representation code.
   star/         # Support STAR data processing.
   teaser/       # Teaser (video) representation code.
   test/         # Facilitate testing.
   user/         # Represent users and their profile data.
   utilities     # Cross-cutting helpers.
   verification  # Support verification of opportunities. 
```

## radgrad/app/imports/startup

The startup/ subdirectory contains code that needs to be loaded immediately upon system startup. It contains three subdirectories:

```
startup/
       both/    # Accounts package configuration code that must run on both client and server.
       client/  # Client-only code for logging, routing, sessions, and accounts.
       server/  # Server-only code for accounts, logging, publications, and database loading.
```

Note that naming this directory does not automatically make this code loaded, much less loaded "first".  There are import
statements in client/ and server/ that are responsible for loading this code. 

## radgrad/app/imports/ui

The ui/ subdirectory contains all of the client-side code for implementing the user interface. We follow the recommended Meteor convention of using "layouts" to provide a standard organization for multiple pages, "pages" to indicate the contents of a page for which there is a URL, and "components" to indicate UI elements that are embedded within a page (and may exist on multiple pages).

So, the ui/ directory structure is:

```
ui/
  components/    # widgets within a page.
  layouts/       # organization for multiple pages.     
  pages/         # URL-accessible page.
  stylesheets/   # currently empty.
  utilities/     # cross-cutting utility code for UI.
```

Within each of these directories are subdirectories. In many cases, the subdirectories reflect a division based on role. So, for example, there is a subdirectory called "advisor/" in each of the components, layouts, and pages/ directories. 
