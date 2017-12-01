# Overview

In RadGrad, we refer to the set of Javascript classes, each of which encapsulates a single MongoDB collection, as the "data model". 

For example, RadGrad provides a class called [CareerGoalCollection](https://github.com/radgrad/radgrad/blob/master/app/imports/api/career/CareerGoalCollection.js), which manages access to a MongoDB collection also called "CareerGoalCollection".  Upon startup, a singleton instance of the CareerGoalCollection class is instantiated and assigned to a variable called "CareerGoals". This variable is available for import into any files that need to access data from the MongoDB CareerGoalCollection collection.

We follow this design pattern for all the elements of the RadGrad data model: there is a Javascript class with the same name as the MongoDB collection, and we create a singleton instance of the class which is used by any clients who need to interact with that data. So, for example, the "Courses" variable is the singleton instance of the CourseCollection Javascript class which manages access to the CourseCollection MongoDB collection, the "Interests" variable is the singleton instance of the InterestCollection Javascript class which manages access to the InterestCollection MongoDB collection, and so on.

This may sound confusing, but it's quite straightforward in practice. Here's a sample line of code to illustrate:

```
const interestType = InterestTypes.findSlugByID(doc.interestTypeID);
```

The variable `InterestTypes` is imported into this client module, and it refers to the singleton instance of the InterestTypeCollection class. (Because these singleton instances have no mutable state, there are no concurrency issues associated with them.) The method `findSlugByID` from this class is called with a string that (hopefully) holds the value of a document ID in the InterestTypeCollection.

This method ends up accessing both the MongoDB InterestTypeCollection and SlugCollection collections in order to return the slug string associated with this InterestType. The point is that client code does not manipulate MongoDB collections directly; instead, they always invoke a method bound to the singleton instance of the corresponding Javascript class.

The implementation of the data model is contained in the imports/api directory.  In some ways, it would have been more descriptive to name this directory "datamodel" rather than "api". We named it "api" in order to conform to [Meteor best practices for application structure](https://guide.meteor.com/structure.html#example-app-structure).

Because every MongoDB collection is encapsulated by a Javascript class, there are two orthogonal ways to describe the structure of the data model. The Class Hierarchy structure describes the structure in terms of inheritance relationships between the Javascript classes.  The Entity-Relationship structure describes the data dependencies between the individual documents contained in MongoDB collections. The following sections in this chapter document both of these views of the data model structure.
