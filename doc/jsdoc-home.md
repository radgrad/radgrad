<a href="https://github.com/radgrad/datamodel"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67" alt="Find me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"></a>

# RadGrad Data Model API

[![CircleCI Badge](https://img.shields.io/circleci/project/radgrad/datamodel.svg)](https://circleci.com/gh/radgrad/datamodel)  [![Codacy Badge](https://api.codacy.com/project/badge/Grade/235330ad954d423a9f063a28048c10ed)](https://www.codacy.com/app/johnson/datamodel) [![Dependency Badge](https://david-dm.org/radgrad/datamodel.svg?path=app)](https://david-dm.org/radgrad/datamodel?path=app) [![devDependency Status](https://david-dm.org/radgrad/datamodel/dev-status.svg?path=app)](https://david-dm.org/radgrad/datamodel?path=app#info=devDependencies)

## Overview

The RadGrad data model defines a set of interdependent entities: Course, CourseInstance, DegreeGoal, DegreePlan, Opportunity, OpportunityInstance, OpportunityType, Semester, Slug, Interest, InterestType, User, and WorkInstance. 

Each of these entities is managed by a corresponding class: SlugCollection, OpportunityTypeCollection, etc. Each collection class provides code to both create and manage instances of the entity, as well as store and retrieve entities from the backing store (MongoDB). 
 
Entities have relationships. For example, Course has a many-to-many relationship with Interest: each course is potentially related to many interests, and each interest is potentially related to many courses.  Relationships are implemented via fields in instances. For example, each instance of a Course (i.e. a MongoDB document) has a field called "interestIds", which contains an array of docIDs to the Interest instances associated with this course. 

The RadGrad data model is fully normalized. That means that every entity has at least one unique key (its MongoDB docID, although certain entities have an additional unique key in the form of a human-friendly string called 'slug'), and that all references to another entity occur through one or the other of its unique keys. 

Not every bidirectional relationship (such as that between Course and Interest) is implemented bi-directionally. For example, while each course instance has a field linking to its Interest instances, each Interest instance does not have a field containing the Course instances it is linked to. This will make some queries fast ("What interests are related to this course?") and other queries relatively slow ("What are the courses related to this interest?").  If "relatively slow" is found to be "too slow" in practice, then back-links will be added as necessary.

The following section documents the entities and relationships in more detail.

## Entity-Relationship Diagrams

#### Student

Students are the primary focus of RadGrad, so it helps to begin explaining the data model through them.  RadGrad has a collection called "User" to manage all of the various user types (Student, Faculty, Admin, Mentor, Alumni), but the most common type of user is an undergraduate student:   

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/Student.png" width="600px">

We show both the relevant Mongo collection schemas as well as the ER diagram.  Along with less important details, RadGrad represents the following characteristics of Students:

  * Their *degree plan*, which represents their past, present, and future (i.e. planned) courses, opportunities, and outside work obligations;
  
  * Their *desired degree*, such as a B.S. in CS, or a B.A. in ICS;
  
  * Their *career goals*, such as "front end web developer", or "graduate school".  Multiple career goals are appropriate and supported.
  
  * Their professional *interests*, such as "security" or "software engineering".
  
  * System-generated *recommendations*, such as courses or opportunities of particular relevance based upon their interests and career goals. 
  
The research hypothesis underlying RadGrad is that if we can accurately model a student's degree plan, goals, and interests, then it will be possible to provide useful recommendations and tailored information about our discipline, which in turn will produce positive changes in our student's undergraduate degree experience, which will ultimately lead to more successful ICS graduates.
  
These requirements for accuracy, usefulness, positive change, and increased success create a high bar for RadGrad. All of the entities and capabilities in the system are designed with the goal of producing these outcomes.

#### Degree Plan

The degree plan represents  past, present, and future (i.e. planned) courses, opportunities, and outside work obligations on a semester-by-semester basis. 

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/degree-plan.png" width="600px">

The plan is composed of a set of "instances" which tie a course, opportunity, and outside job to a specific semester and student.

For more details, see the [Degree Plan](http://radgrad.org/features/degree-plan.html) page. 


#### Course

Courses are represented through a combination of three entities.  The "Course" entity represents information about a course that is (assumed to be) "invariant"---its description, credit hours, name, and number.
 
CourseInstances represent the experience of a specific student taking a course in a specific semester (and eventually obtaining a grade).  

Finally, the Semester entity provides a convenient way to represent semesters.

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/Course.png" width="600px">

The [ICS Syllabus Page](http://courses.ics.hawaii.edu/syllabuses/) provides the list of courses managed in RadGrad.

The set of Courses are defined and managed by RadGrad admins. 

Historical CourseInstance data is provided by uploading data from STAR. Current and future CourseInstance data is provided by the student user.

#### Opportunity

The Opportunity, OpportunityType, and OpportunityInstance entities enable RadGrad to represent extracurricular activities supporting professional development.  They contrast with curricular activities (i.e. coursework), as well as extracurricular activities not related to professional development (i.e. work).

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/Opportunity.png" width="600px">

For more details, see the [Opportunity Page](http://radgrad.org/features/opportunity.html)

#### Work

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/Work.png" width="600px">

For more details, see the [Work Page](http://radgrad.org/features/work.html).

## Class Hierarchy

The implementation of the above entities involves a great deal of common functionality.  For example, all of these entities require a means to look up the document based upon the docID, and to determine whether or not a given docID represents an entity of a given type. 

To encapsulate this shared functionality, RadGrad implements a class hierarchy which starts with a set of three "Base" classes: BaseCollection, BaseTypeCollection, and BaseInstanceCollection. All of the RadGrad entities are direct subclasses of one of these three Base classes depending upon what kind of shared functionality they need to inherit from a superclass. The following diagram illustrates how all of the RadGrad entity classes inherit from one of the three Base classes:

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/Hierarchy.png" width="100%">

In general, the BaseCollection superclass contains fields and methods useful to every RadGrad entity. The BaseTypeCollection superclass inherits from BaseCollection, and factors out the structure common to the "Type" entities. The BaseInstanceCollection superclass inherits from BaseCollection, adds methods useful to the remaining entities as well as not imposing a predefined field structure.


## Development procedures and scripts

### Installation 

To work with the RadGrad data model, first download and install Meteor. 

Next, download the source code from [https://github.com/radgrad/datamodel](https://github.com/radgrad/datamodel).

Next, cd to the app/ directory and invoke npm:

```
app$ npm install
```

This will download and install the third-party libraries required to run this system.

### Run the system

This data model application does not include a user interface, but it is nonetheless possible to run the system as follows:

```
app$ meteor npm start
```

Go to [http://localhost:3000](http://localhost:3000) to confirm that the system can load successfully:


<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/home-page.png" width="100%">


### Code style

We aspire to conform to the [AirBnB ES6 Javascript Style Guide](http://airbnb.io/javascript/), and use [ESLint](http://eslint.org/) to enforce compliance as much as possible with these recommendations. 

You can run ESLint configured for AirBnB and Meteor from the command line as follows:

```
app$ meteor npm run lint
```

During active development, however, a much better way to enforce ESLint guidelines is to install ESLint into your editor. For example, here is one way to configure IntelliJ IDEA to run ESLint interactively during coding:

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/intellij-eslint-preferences.png" width="100%">

### Testing

This application provides two ways to test: interactively and using continuous integration. 

We use two versions of the [Mocha](https://mochajs.org/) test runner (one for interactive testing, and one for CI) and  [Chai Expect Assertions](http://chaijs.com/guide/styles/#expect). We follow recommendations from the [Meteor Guide Unit Testing Chapter](http://guide.meteor.com/testing.html#unit-testing). 

Each collection class contains its tests in a "sibling" file. For example, tests for SlugCollection.js are located in SlugCollection.test.js.

#### Interactive testing (test-watch)

To start up the interactive test process, invoke:

```
app$ meteor npm run test-watch
```

Interactive testing uses the [practicalmeteor:mocha](https://atmospherejs.com/practicalmeteor/mocha) test driver to start up a parallel Meteor process running at [http://localhost:3100](http://localhost:3100). Here is a screenshot from early in development with only a few tests:
 
<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/tests-page.png" width="100%">
 
Note that testing is server-side, because this package does not implement a user interface. 

Also note that it is useful to have the console open along with this test page, because additional error output useful for debugging will occasionally appear here.

As you save changes to your code, the test process will detect changes to the file system, rerun the tests, and automatically refresh this page with the results. 

#### Continuous integration (test)

We provide [CircleCI automated builds for the RadGrad Data Model](https://circleci.com/gh/radgrad/datamodel). Each time someone commits to the [master branch of the RadGrad datamodel GitHub repo](https://github.com/radgrad/datamodel), the CircleCI system will clone this branch and run 'lint' and 'test. 

Here is an example build and run of the system:

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/circleci.png" width="100%">

See the [circle.yml](https://github.com/radgrad/datamodel/blob/master/circle.yml) file for configuration info.

Note that continuous integration in Meteor requires a different Mocha driver called [dispatch:mocha-phantomjs](https://atmospherejs.com/dispatch/mocha-phantomjs), and that if practicalmeteor:mocha is installed when running tests using dispatch:mocha-phantomjs, then certain output is suppressed. To avoid this problem, circle.yml contains a script to remove the practicalmeteor:mocha package when building the system under CI.

Because interactive testing and continuous integration use different mocha driver packages, the test files cannot import Mocha driver functions (i.e. describe, it, before, after) since that would pin these functions to a specific driver package in the code.  To avoid ESLint errors, all test files include the mocha-env ESLint directive.    
 

### API Documentation

The documentation you are now reading is created using [JSDoc](http://usejsdoc.org/) with the [docdash](https://github.com/clenemt/docdash) theme.
 
To generate the documentation locally, invoke:

```
app$ meteor npm run jsdoc
```

Note that running this command will generate the HTML version of the documentation into a "sibling" directory of this repo specified as `../../datamodel-gh-pages`.  That directory should contain the gh-pages branch of this repo. 

To make the documentation globally available, commit the gh-pages branch, after which it will be accessable at [http://radgrad.org/datamodel/](http://radgrad.org/datamodel/).

## Directory layout

The Data Model repository has the following top-level directory structure:

```
app/     # the application.
config/  # configuration files for deployment.
doc/     # supplemental documentation.
```

The app/ directory layout is based on the [Meteor todos](https://github.com/meteor/todos) sample application, which provides best practices for application structure following the [Meteor Guide](http://guide.meteor.com/structure.html).

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
Note that this app does not have a 'ui' directory, because the UI for RadGrad will be developed as a separate application that will import this data model as a package.

## Testing notes

Here are some issues regarding tests for the datamodel package.

* Arrow function use with Mocha is discouraged. See [http://mochajs.org/#arrow-functions](http://mochajs.org/#arrow-functions).

* The standard "test" mode for Meteor (as opposed to "full-app" mode) does not support client subscriptions. So, it doesn't really make sense to try to test the data model on the client side, and thus all data model tests are wrapped in a `Meteor.isServer` block.  Testing of client subscriptions will be done as part of UI testing.


