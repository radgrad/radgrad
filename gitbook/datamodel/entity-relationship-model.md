# Entity-Relationship Model

The prior section illustrated the relationships between the data model entities in terms of class inheritance. That perspective reveals how code is shared.

This section documents the direct relationships between data model entities.  Depending upon your perspective, you might think of these references as "pointers", "foreign keys", or "references".  For example, each document in the CourseInstance collection needs to refer to a specific Semester in which the course instance occurs, a specific student who has/is/will be taking the course, and a specific Course. These references are implemented via fields in the CourseInstance document that hold the docID to a document in the other entity's collection. So, each CourseInstance document has the following fields (among others): SemesterID, StudentID, and CourseID.

## Opportunity

In RadGrad, extracurricular events and activities are called "Opportunities", and are represented by three entities: Opportunity, OpportunityType, and OpportunityInstance. 

<img src="images/Opportunity.png" width="100%"> 
 
OpportunityType specifies the kind of Opportunity: club, event, online course, etc.

Opportunity represents the opportunity "in the abstract", specifying its description, sponsor (i.e the faculty member responsible for managing the description and verifying student participation), the ICE points, the semesters it might be available, etc.

OpportunityInstance represents an "instantiation" of the Opportunity in a specific semester for a specific student. It also duplicates the ICE points and the sponsorID from the Opportunity. This enables an instance to depart from its parent Opportunity with respect to these values, and also speeds lookup.




