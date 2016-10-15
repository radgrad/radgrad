The RadGrad data model defines a set of interdependent entities: Course, CourseInstance, DegreeGoal, DegreePlan, Opportunity, OpportunityInstance, OpportunityType, Semester, Slug, Interest, InterestType, User, and WorkInstance. 

Each of these entities is managed by a corresponding class: SlugCollection, OpportunityTypeCollection, etc. Each collection class provides code to both create and manage instances of the entity, as well as store and retrieve entities from the backing store (MongoDB). 
 
Entities have relationships. For example, Course has a many-to-many relationship with Interest: each course is potentially related to many interests, and each interest is potentially related to many courses.  Relationships are implemented via fields in instances. For example, each instance of a Course (i.e. a MongoDB document) has a field called "interestIds", which contains an array of docIDs to the Interest instances associated with this course. 

The RadGrad data model is fully normalized. That means that every entity has at least one unique key (its MongoDB docID, although certain entities have an additional unique key in the form of a human-friendly string called 'slug'), and that all references to another entity occur through one or the other of its unique keys. 

Not every bidirectional relationship (such as that between Course and Interest) is implemented bi-directionally. For example, while each course instance has a field linking to its Interest instances, each Interest instance does not have a field containing the Course instances it is linked to. This will make some queries fast ("What interests are related to this course?") and other queries relatively slow ("What are the courses related to this interest?").  If "relatively slow" is found to be "too slow" in practice, then back-links will be added as necessary.

The following section documents the entities and relationships in more detail.
