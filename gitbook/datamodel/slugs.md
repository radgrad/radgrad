# Slugs

"Slug" is a term commonly used in web application development to denote a unique string that can be used as part of a URL to identify a domain entity.  To facilitate their use in URLs, slugs are generally lower case, and consist only of letters, numbers, and hyphens or underscores. For example, in RadGrad, the slug for the "Software Engineering" Interest might be "software-engineering".

In RadGrad, both slugs and the 14 character MongoDB document IDs uniquely identify documents.  However, if you reset and reinitialize a RadGrad database, the document ID will be different, but its slug will stay the same.

Slugs are used heavily in RadGrad when initializing the database from a fixture file in order to represent relationships between different entities without reference to their docID.  For example, here is an example invocation of the CareerGoals define method:

```
CareerGoals.define({ name: 'Database Administrator',
                     slug: 'database-administrator',
                     description: 'Wrangler of SQL.',
                     interests: ['application-development', 'software-engineering', 'databases'],
                     moreInformation: 'http://www.bls.gov/ooh/database-administrators.htm' });
```

First, you can see that the slug "database-administrator" has been passed into the define method, so that this document can be referred to in future definitions by that string.

Second, the interests field contains an array of three slugs: "application-development", "software-engineering", "databases". Internally, the MongoDB document for this Database Administrator Career Goal will contain the 14 character document IDs for these interests, but we don't need to worry about that in the fixture file: we can just refer to the slugs. 

RadGrad does not support forward referencing of Slugs. For example, when the above CareerGoal definition executes, if a Slug is referenced (such as "application-development") that is not defined, then an error is thrown. Thus, the order in which RadGrad data is loaded is important and there can be no circular dependencies among entity definitions.

Slugs form a unique namespace across all entities: you cannot use the same string to denote an Interest Slug and a CareerGoal slug, for example.
