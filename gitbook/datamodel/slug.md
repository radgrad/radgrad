# Slug

"Slug" is a term used in web application development to denote a string that can be used as part of a URL to uniquely identify an entity.  For example, in RadGrad, the slug for the "Software Engineering" Interest might be "software-engineering".

Slugs are different from, say docIDs, in that a slug is independent from a particular instantiation of a database.  If you reset and reinitialize the RadGrad database, the docID for the "Software Engineering" Interest document will change, but its slug remains "software-engineering".

Slugs are used heavily in RadGrad when initializing the system in order to represent relationships between different entities without reference to their docID.  For example, here is an example definition of a CareerGoal:

```
CareerGoals.define({ name: 'Database Administrator',
                     slug: 'database-administrator',
                     description: 'Wrangler of SQL.',
                     interests: ['application-development', 'software-engineering', 'databases'],
                     moreInformation: 'http://www.bls.gov/ooh/database-administrators.htm' });
```

Note that in order to establish a relationship between this Career Goal ("Database Administrator") and the Interests it relates to (for example, "Application Development"), we do not have to specify the docID. Instead, we refer to the interests through their Slugs, which are logical references rather than concrete (docID) references. 

There can be no forward referencing of Slugs. For example, when the above CareerGoal definition executes, if a Slug is referenced (such as "application-development") that is not defined, then an error is thrown. Thus, the order in which RadGrad data is loaded is important and there can be no circular dependencies among entity definitions.

By convention in RadGrad, slugs are always all lowercase, with words separated by dashes.  Slugs form a unique namespace across all entities: you cannot use the same string to denote an Interest Slug and a CareerGoal slug, for example.


## Implementation

See [SlugCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-Slug-SlugCollection.html).
 
