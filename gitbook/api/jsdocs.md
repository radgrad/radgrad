## Modules

<dl>
<dt><a href="#module_Base">Base</a></dt>
<dd></dd>
<dt><a href="#module_BaseInstance">BaseInstance</a></dt>
<dd></dd>
<dt><a href="#module_BaseType">BaseType</a></dt>
<dd></dd>
<dt><a href="#module_BaseUtilities">BaseUtilities</a></dt>
<dd></dd>
<dt><a href="#module_CareerGoal">CareerGoal</a></dt>
<dd></dd>
<dt><a href="#module_Course">Course</a></dt>
<dd></dd>
<dt><a href="#module_CourseInstance">CourseInstance</a></dt>
<dd></dd>
<dt><a href="#module_SampleCourses">SampleCourses</a></dt>
<dd></dd>
<dt><a href="#module_DesiredDegree">DesiredDegree</a></dt>
<dd></dd>
<dt><a href="#module_Feedback">Feedback</a></dt>
<dd></dd>
<dt><a href="#module_FeedbackFunctions">FeedbackFunctions</a></dt>
<dd></dd>
<dt><a href="#module_FeedbackInstance">FeedbackInstance</a></dt>
<dd></dd>
<dt><a href="#module_FeedbackType">FeedbackType</a></dt>
<dd></dd>
<dt><a href="#module_SampleFeedbacks">SampleFeedbacks</a></dt>
<dd></dd>
<dt><a href="#module_IceProcessor">IceProcessor</a></dt>
<dd></dd>
<dt><a href="#module_Interest">Interest</a></dt>
<dd></dd>
<dt><a href="#module_InterestType">InterestType</a></dt>
<dd></dd>
<dt><a href="#module_SampleInterests">SampleInterests</a></dt>
<dd></dd>
<dt><a href="#module_Opportunity">Opportunity</a></dt>
<dd></dd>
<dt><a href="#module_OpportunityInstance">OpportunityInstance</a></dt>
<dd></dd>
<dt><a href="#module_OpportunityType">OpportunityType</a></dt>
<dd></dd>
<dt><a href="#module_SampleOpportunities">SampleOpportunities</a></dt>
<dd></dd>
<dt><a href="#module_Role">Role</a></dt>
<dd></dd>
<dt><a href="#module_Semester">Semester</a></dt>
<dd></dd>
<dt><a href="#module_Slug">Slug</a></dt>
<dd></dd>
<dt><a href="#module_StarProcessor">StarProcessor</a></dt>
<dd></dd>
<dt><a href="#module_SampleUsers">SampleUsers</a></dt>
<dd></dd>
<dt><a href="#module_User">User</a></dt>
<dd></dd>
<dt><a href="#module_WorkInstance">WorkInstance</a></dt>
<dd></dd>
<dt><a href="#module_CareerGoalDefinitions">CareerGoalDefinitions</a></dt>
<dd></dd>
<dt><a href="#module_CourseDefinitions">CourseDefinitions</a></dt>
<dd></dd>
<dt><a href="#module_InterestDefinitions">InterestDefinitions</a></dt>
<dd></dd>
<dt><a href="#module_LoadDefinitions">LoadDefinitions</a></dt>
<dd></dd>
<dt><a href="#module_OpportunityDefinitions">OpportunityDefinitions</a></dt>
<dd></dd>
<dt><a href="#module_UserDefinitions">UserDefinitions</a></dt>
<dd></dd>
</dl>

<a name="module_Base"></a>

## Base

* [Base](#module_Base)
    * [module.exports](#exp_module_Base--module.exports) ⏏
        * [~BaseCollection](#module_Base--module.exports..BaseCollection)
            * [new BaseCollection(type, schema)](#new_module_Base--module.exports..BaseCollection_new)
            * [.count()](#module_Base--module.exports..BaseCollection+count) ⇒ <code>Number</code>
            * [.publish()](#module_Base--module.exports..BaseCollection+publish)
            * [.subscribe()](#module_Base--module.exports..BaseCollection+subscribe)
            * [.findDoc(name)](#module_Base--module.exports..BaseCollection+findDoc) ⇒ <code>Object</code>
            * [.find(selector, options)](#module_Base--module.exports..BaseCollection+find) ⇒ <code>Mongo.Cursor</code>
            * [.isDefined(name)](#module_Base--module.exports..BaseCollection+isDefined) ⇒ <code>boolean</code>
            * [.removeIt(name)](#module_Base--module.exports..BaseCollection+removeIt)
            * [.removeAll()](#module_Base--module.exports..BaseCollection+removeAll)
            * [.getType()](#module_Base--module.exports..BaseCollection+getType) ⇒ <code>String</code>
            * [.toString()](#module_Base--module.exports..BaseCollection+toString) ⇒ <code>String</code>
            * [.assertDefined(name)](#module_Base--module.exports..BaseCollection+assertDefined)
            * [.assertAllDefined(names)](#module_Base--module.exports..BaseCollection+assertAllDefined)

<a name="exp_module_Base--module.exports"></a>

### module.exports ⏏
The BaseCollection used by all RadGrad entities.

**Kind**: Exported member  
<a name="module_Base--module.exports..BaseCollection"></a>

#### module.exports~BaseCollection
BaseCollection is an abstract superclass of all RadGrad data model entities.
It is the direct superclass for SlugCollection and SemesterCollection.
Other collection classes are derived from BaseInstanceCollection or BaseTypeCollection, which are abstract
classes that inherit from this one.

**Kind**: inner class of <code>[module.exports](#exp_module_Base--module.exports)</code>  

* [~BaseCollection](#module_Base--module.exports..BaseCollection)
    * [new BaseCollection(type, schema)](#new_module_Base--module.exports..BaseCollection_new)
    * [.count()](#module_Base--module.exports..BaseCollection+count) ⇒ <code>Number</code>
    * [.publish()](#module_Base--module.exports..BaseCollection+publish)
    * [.subscribe()](#module_Base--module.exports..BaseCollection+subscribe)
    * [.findDoc(name)](#module_Base--module.exports..BaseCollection+findDoc) ⇒ <code>Object</code>
    * [.find(selector, options)](#module_Base--module.exports..BaseCollection+find) ⇒ <code>Mongo.Cursor</code>
    * [.isDefined(name)](#module_Base--module.exports..BaseCollection+isDefined) ⇒ <code>boolean</code>
    * [.removeIt(name)](#module_Base--module.exports..BaseCollection+removeIt)
    * [.removeAll()](#module_Base--module.exports..BaseCollection+removeAll)
    * [.getType()](#module_Base--module.exports..BaseCollection+getType) ⇒ <code>String</code>
    * [.toString()](#module_Base--module.exports..BaseCollection+toString) ⇒ <code>String</code>
    * [.assertDefined(name)](#module_Base--module.exports..BaseCollection+assertDefined)
    * [.assertAllDefined(names)](#module_Base--module.exports..BaseCollection+assertAllDefined)

<a name="new_module_Base--module.exports..BaseCollection_new"></a>

##### new BaseCollection(type, schema)
Superclass constructor for all RadGrad entities.
Defines internal fields needed by all entities: _type, _collectionName, _collection, and _schema.


| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | The name of the entity defined by the subclass. |
| schema | <code>SimpleSchema</code> | The schema for validating fields on insertion to the DB. |

<a name="module_Base--module.exports..BaseCollection+count"></a>

##### baseCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name="module_Base--module.exports..BaseCollection+publish"></a>

##### baseCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
<a name="module_Base--module.exports..BaseCollection+subscribe"></a>

##### baseCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
<a name="module_Base--module.exports..BaseCollection+findDoc"></a>

##### baseCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name="module_Base--module.exports..BaseCollection+find"></a>

##### baseCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name="module_Base--module.exports..BaseCollection+isDefined"></a>

##### baseCollection.isDefined(name) ⇒ <code>boolean</code>
Returns true if the passed entity is in this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**Returns**: <code>boolean</code> - True if name exists in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | The docID, or an object specifying a documennt. |

<a name="module_Base--module.exports..BaseCollection+removeIt"></a>

##### baseCollection.removeIt(name)
A stricter form of remove that throws an error if the document or docID could not be found in this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | A document or docID in this collection. |

<a name="module_Base--module.exports..BaseCollection+removeAll"></a>

##### baseCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
<a name="module_Base--module.exports..BaseCollection+getType"></a>

##### baseCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name="module_Base--module.exports..BaseCollection+toString"></a>

##### baseCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
<a name="module_Base--module.exports..BaseCollection+assertDefined"></a>

##### baseCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name="module_Base--module.exports..BaseCollection+assertAllDefined"></a>

##### baseCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[BaseCollection](#module_Base--module.exports..BaseCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_BaseInstance"></a>

## BaseInstance
<a name="exp_module_BaseInstance--module.exports"></a>

### module.exports ⏏
Provide this class for use by instance collections such as Interest.

**Kind**: Exported member  
<a name="module_BaseType"></a>

## BaseType
<a name="exp_module_BaseType--module.exports"></a>

### module.exports ⏏
Provide this class for use by OpportunityType and TagType.

**Kind**: Exported member  
<a name="module_BaseUtilities"></a>

## BaseUtilities
<a name="module_CareerGoal"></a>

## CareerGoal

* [CareerGoal](#module_CareerGoal)
    * _static_
        * [.CareerGoals](#module_CareerGoal.CareerGoals)
    * _inner_
        * [~CareerGoalCollection](#module_CareerGoal..CareerGoalCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new CareerGoalCollection()](#new_module_CareerGoal..CareerGoalCollection_new)
            * [.define(description)](#module_CareerGoal..CareerGoalCollection+define) ⇒
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_CareerGoal.CareerGoals"></a>

### CareerGoal.CareerGoals
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[CareerGoal](#module_CareerGoal)</code>  
<a name="module_CareerGoal..CareerGoalCollection"></a>

### CareerGoal~CareerGoalCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
CareerGoals represent the professional future(s) that the student wishes to work toward.
Note: Career Goals will probably need to be defined with a hook function that provides recommendations based upon
the specifics of the career. At that point, we'll probably need a new Base class that this class will extend.

**Kind**: inner class of <code>[CareerGoal](#module_CareerGoal)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~CareerGoalCollection](#module_CareerGoal..CareerGoalCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new CareerGoalCollection()](#new_module_CareerGoal..CareerGoalCollection_new)
    * [.define(description)](#module_CareerGoal..CareerGoalCollection+define) ⇒
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_CareerGoal..CareerGoalCollection_new"></a>

#### new CareerGoalCollection()
Creates the CareerGoal collection.

<a name="module_CareerGoal..CareerGoalCollection+define"></a>

#### careerGoalCollection.define(description) ⇒
Defines a new CareerGoal with its name, slug, and description.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug already exists.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, description, interests, and moreInformation. Slug must be globally unique and previously undefined. Interests is a (possibly empty) array of defined interest slugs or interestIDs. Syllabus is optional. If supplied, should be a URL. MoreInformation is optional. If supplied, should be a URL. |

**Example**  
```js
CareerGoals.define({ name: 'Database Administrator',
                     slug: 'database-administrator',
                     description: 'Wrangler of SQL.',
                     interests: ['application-development', 'software-engineering', 'databases'],
                     moreInformation: 'http://www.bls.gov/ooh/database-administrators.htm' });
```
<a name=""></a>

#### careerGoalCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### careerGoalCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### careerGoalCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### careerGoalCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### careerGoalCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### careerGoalCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### careerGoalCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### careerGoalCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### careerGoalCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### careerGoalCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### careerGoalCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
<a name=""></a>

#### careerGoalCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
<a name=""></a>

#### careerGoalCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### careerGoalCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### careerGoalCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
<a name=""></a>

#### careerGoalCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### careerGoalCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
<a name=""></a>

#### careerGoalCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### careerGoalCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[CareerGoalCollection](#module_CareerGoal..CareerGoalCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_Course"></a>

## Course

* [Course](#module_Course)
    * _static_
        * [.Courses](#module_Course.Courses)
    * _inner_
        * [~CourseCollection](#module_Course..CourseCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new CourseCollection()](#new_module_Course..CourseCollection_new)
            * [.define(description)](#module_Course..CourseCollection+define) ⇒
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_Course.Courses"></a>

### Course.Courses
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[Course](#module_Course)</code>  
<a name="module_Course..CourseCollection"></a>

### Course~CourseCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
Represents a specific course, such as "ICS 311".
To represent a specific course for a specific semester, use CourseInstance.

**Kind**: inner class of <code>[Course](#module_Course)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~CourseCollection](#module_Course..CourseCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new CourseCollection()](#new_module_Course..CourseCollection_new)
    * [.define(description)](#module_Course..CourseCollection+define) ⇒
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_Course..CourseCollection_new"></a>

#### new CourseCollection()
Creates the Course collection.

<a name="module_Course..CourseCollection+define"></a>

#### courseCollection.define(description) ⇒
Defines a new Course.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the definition includes a defined slug or undefined interest or invalid creditHrs.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, number, description, creditHrs, interests. Slug must not be previously defined. CreditHrs is optional and defaults to 3. If supplied, must be a number between 1 and 15. Interests is a (possibly empty) array of defined interest slugs or interestIDs. Syllabus is optional. If supplied, should be a URL. MoreInformation is optional. If supplied, should be a URL. Prerequisites is optional. If supplied, must be an array of previously defined Course slugs or courseIDs. |

**Example**  
```js
Courses.define({ name: 'Introduction to Scripting',
                 slug: 'ics215',
                 number: 'ICS 215',
                 description: 'Introduction to scripting languages for the integration of applications.',
                 creditHrs: 4,
                 interests: ['perl', 'javascript', 'ruby'],
                 syllabus: 'http://courses.ics.hawaii.edu/syllabuses/ICS215.html',
                 moreInformation: 'http://courses.ics.hawaii.edu/ReviewICS215/',
                 prerequisites: ['ics211'] });
```
<a name=""></a>

#### courseCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### courseCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### courseCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### courseCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### courseCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### courseCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### courseCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### courseCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### courseCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### courseCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### courseCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
<a name=""></a>

#### courseCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
<a name=""></a>

#### courseCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### courseCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### courseCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
<a name=""></a>

#### courseCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### courseCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
<a name=""></a>

#### courseCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### courseCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[CourseCollection](#module_Course..CourseCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_CourseInstance"></a>

## CourseInstance

* [CourseInstance](#module_CourseInstance)
    * _static_
        * [.CourseInstances](#module_CourseInstance.CourseInstances)
    * _inner_
        * [~CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
            * [new CourseInstanceCollection()](#new_module_CourseInstance..CourseInstanceCollection_new)
            * [.define(description)](#module_CourseInstance..CourseInstanceCollection+define) ⇒
            * [.findCourseName(courseInstanceID)](#module_CourseInstance..CourseInstanceCollection+findCourseName) ⇒ <code>String</code>
            * [.toString(courseInstanceID)](#module_CourseInstance..CourseInstanceCollection+toString) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.isDefined(name)](#) ⇒ <code>boolean</code>
            * [.removeIt(name)](#)
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_CourseInstance.CourseInstances"></a>

### CourseInstance.CourseInstances
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[CourseInstance](#module_CourseInstance)</code>  
<a name="module_CourseInstance..CourseInstanceCollection"></a>

### CourseInstance~CourseInstanceCollection ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
Represents the taking of a course by a specific student in a specific semester.

**Kind**: inner class of <code>[CourseInstance](#module_CourseInstance)</code>  
**Extends:** <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>  

* [~CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
    * [new CourseInstanceCollection()](#new_module_CourseInstance..CourseInstanceCollection_new)
    * [.define(description)](#module_CourseInstance..CourseInstanceCollection+define) ⇒
    * [.findCourseName(courseInstanceID)](#module_CourseInstance..CourseInstanceCollection+findCourseName) ⇒ <code>String</code>
    * [.toString(courseInstanceID)](#module_CourseInstance..CourseInstanceCollection+toString) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.isDefined(name)](#) ⇒ <code>boolean</code>
    * [.removeIt(name)](#)
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_CourseInstance..CourseInstanceCollection_new"></a>

#### new CourseInstanceCollection()
Creates the CourseInstance collection.

<a name="module_CourseInstance..CourseInstanceCollection+define"></a>

#### courseInstanceCollection.define(description) ⇒
Defines a new CourseInstance.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the definition includes an undefined course or student.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys semester, course, verified, notCS, grade, studen. Required fields: semester, student, course, which must all be valid slugs or instance IDs. If the course slug is 'other', then the note field will be used as the course number. Optional fields: note (defaults to ''), valid (defaults to false), grade (defaults to ''). CreditHrs defaults to the creditHrs assigned to course, or can be provided explicitly. |

**Example**  
```js
// To define an instance of a CS course:
CourseInstances.define({ semester: 'Spring-2016',
                         course: 'ics311',
                         verified: false,
                         grade: 'B',
                         student: 'joesmith' });
// To define an instance of a non-CS course:
CourseInstances.define({ semester: 'Spring-2016',
                         course: 'other',
                         note: 'ENG 101',
                         verified: true,
                         creditHrs: 3,
                         grade: 'B',
                         student: 'joesmith' });
```
<a name="module_CourseInstance..CourseInstanceCollection+findCourseName"></a>

#### courseInstanceCollection.findCourseName(courseInstanceID) ⇒ <code>String</code>
**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Returns**: <code>String</code> - The course name associated with courseInstanceID.  
**Throws**:

- <code>Meteor.Error</code> If courseInstanceID is not a valid ID.


| Param | Description |
| --- | --- |
| courseInstanceID | The course instance ID. |

<a name="module_CourseInstance..CourseInstanceCollection+toString"></a>

#### courseInstanceCollection.toString(courseInstanceID) ⇒ <code>String</code>
**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Overrides:** <code>[toString](#module_Base--module.exports..BaseCollection+toString)</code>  
**Returns**: <code>String</code> - A formatted string representing the course instance.  
**Throws**:

- <code>Meteor.Error</code> If not a valid ID.


| Param | Description |
| --- | --- |
| courseInstanceID | The course instance ID. |

<a name=""></a>

#### courseInstanceCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### courseInstanceCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
<a name=""></a>

#### courseInstanceCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
<a name=""></a>

#### courseInstanceCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### courseInstanceCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### courseInstanceCollection.isDefined(name) ⇒ <code>boolean</code>
Returns true if the passed entity is in this collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Returns**: <code>boolean</code> - True if name exists in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | The docID, or an object specifying a documennt. |

<a name=""></a>

#### courseInstanceCollection.removeIt(name)
A stricter form of remove that throws an error if the document or docID could not be found in this collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | A document or docID in this collection. |

<a name=""></a>

#### courseInstanceCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
<a name=""></a>

#### courseInstanceCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### courseInstanceCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### courseInstanceCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_SampleCourses"></a>

## SampleCourses

* [SampleCourses](#module_SampleCourses)
    * [.makeSampleCourse(args)](#module_SampleCourses.makeSampleCourse) ⇒ <code>String</code>
    * [.makeSampleCourseInstance(student, args)](#module_SampleCourses.makeSampleCourseInstance) ⇒ <code>String</code>

<a name="module_SampleCourses.makeSampleCourse"></a>

### SampleCourses.makeSampleCourse(args) ⇒ <code>String</code>
Creates a Course with a unique slug and returns its docID.

**Kind**: static method of <code>[SampleCourses](#module_SampleCourses)</code>  
**Returns**: <code>String</code> - The docID of the newly generated Course.  

| Param | Description |
| --- | --- |
| args | An optional object containing arguments to the courses.define function. |

<a name="module_SampleCourses.makeSampleCourseInstance"></a>

### SampleCourses.makeSampleCourseInstance(student, args) ⇒ <code>String</code>
Creates a CourseInstance with a unique slug and returns its docID.
Also creates a new Course.

**Kind**: static method of <code>[SampleCourses](#module_SampleCourses)</code>  
**Returns**: <code>String</code> - The docID for the newly generated Interest.  

| Param | Description |
| --- | --- |
| student | The student slug associated with this course. |
| args | Optional object providing arguments to the CourseInstance definition. |

<a name="module_DesiredDegree"></a>

## DesiredDegree

* [DesiredDegree](#module_DesiredDegree)
    * _static_
        * [.DesiredDegrees](#module_DesiredDegree.DesiredDegrees)
    * _inner_
        * [~DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection) ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
            * [new DesiredDegreeCollection()](#new_module_DesiredDegree..DesiredDegreeCollection_new)
            * [.define(description)](#module_DesiredDegree..DesiredDegreeCollection+define) ⇒
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_DesiredDegree.DesiredDegrees"></a>

### DesiredDegree.DesiredDegrees
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[DesiredDegree](#module_DesiredDegree)</code>  
<a name="module_DesiredDegree..DesiredDegreeCollection"></a>

### DesiredDegree~DesiredDegreeCollection ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
DesiredDegrees specifies the set of degrees possible in this department.

**Kind**: inner class of <code>[DesiredDegree](#module_DesiredDegree)</code>  
**Extends:** <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>  

* [~DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection) ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
    * [new DesiredDegreeCollection()](#new_module_DesiredDegree..DesiredDegreeCollection_new)
    * [.define(description)](#module_DesiredDegree..DesiredDegreeCollection+define) ⇒
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_DesiredDegree..DesiredDegreeCollection_new"></a>

#### new DesiredDegreeCollection()
Creates the DesiredDegree collection.

<a name="module_DesiredDegree..DesiredDegreeCollection+define"></a>

#### desiredDegreeCollection.define(description) ⇒
Defines a new DesiredDegree with its name, slug, and description.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Overrides:** <code>[define](#module_Base--module.exportsType..BaseTypeCollection+define)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug already exists.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, and description. Slug must be globally unique and previously undefined. |

**Example**  
```js
DesiredDegrees.define({ name: 'B.S. in Computer Science',
                        slug: 'bs-cs',
                        description: 'Focuses on software technology and provides a foundation in math.' });
```
<a name=""></a>

#### desiredDegreeCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### desiredDegreeCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### desiredDegreeCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### desiredDegreeCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### desiredDegreeCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### desiredDegreeCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the document associated with the passed slug.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>Object</code> - The document.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an
instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### desiredDegreeCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slugID associated with this docID.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>String</code> - The slug  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### desiredDegreeCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### desiredDegreeCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### desiredDegreeCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
<a name=""></a>

#### desiredDegreeCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
<a name=""></a>

#### desiredDegreeCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### desiredDegreeCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### desiredDegreeCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
<a name=""></a>

#### desiredDegreeCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### desiredDegreeCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
<a name=""></a>

#### desiredDegreeCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### desiredDegreeCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_Feedback"></a>

## Feedback

* [Feedback](#module_Feedback)
    * _static_
        * [.Feedbacks](#module_Feedback.Feedbacks)
    * _inner_
        * [~FeedbackCollection](#module_Feedback..FeedbackCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new FeedbackCollection()](#new_module_Feedback..FeedbackCollection_new)
            * [.define(description)](#module_Feedback..FeedbackCollection+define) ⇒
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_Feedback.Feedbacks"></a>

### Feedback.Feedbacks
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[Feedback](#module_Feedback)</code>  
<a name="module_Feedback..FeedbackCollection"></a>

### Feedback~FeedbackCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
Feedback is the generalized representation for recommendations, warnings, and (perhaps in future) predictions.

**Kind**: inner class of <code>[Feedback](#module_Feedback)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~FeedbackCollection](#module_Feedback..FeedbackCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new FeedbackCollection()](#new_module_Feedback..FeedbackCollection_new)
    * [.define(description)](#module_Feedback..FeedbackCollection+define) ⇒
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_Feedback..FeedbackCollection_new"></a>

#### new FeedbackCollection()
Creates the Feedback collection.

<a name="module_Feedback..FeedbackCollection+define"></a>

#### feedbackCollection.define(description) ⇒
Defines a new Feedback with its name, slug, and description.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug already exists or feedbackType is not a legal FeedbackType.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, description, feedbackType. Slug must be globally unique and previously undefined. You must define a static method in the class FeedbackFunctions with the same name as the slug that implements the FeedbackFunction associated with this Feedback. |

**Example**  
```js
Feedbacks.define({ name: 'Courses based on user interests',
                   slug: 'CourseRecommendationsBasedOnInterests',
                   description: 'Recommends courses to take not already in plan based on matching interests',
                   feedbackType: FeedbackType.RECOMMENDATION });
```
<a name=""></a>

#### feedbackCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### feedbackCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### feedbackCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### feedbackCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### feedbackCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### feedbackCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### feedbackCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### feedbackCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### feedbackCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### feedbackCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### feedbackCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
<a name=""></a>

#### feedbackCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
<a name=""></a>

#### feedbackCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### feedbackCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### feedbackCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
<a name=""></a>

#### feedbackCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### feedbackCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
<a name=""></a>

#### feedbackCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### feedbackCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[FeedbackCollection](#module_Feedback..FeedbackCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_FeedbackFunctions"></a>

## FeedbackFunctions

* [FeedbackFunctions](#module_FeedbackFunctions)
    * [.FeedbackFunctions](#module_FeedbackFunctions.FeedbackFunctions)
        * [new FeedbackFunctions()](#new_module_FeedbackFunctions.FeedbackFunctions_new)

<a name="module_FeedbackFunctions.FeedbackFunctions"></a>

### FeedbackFunctions.FeedbackFunctions
**Kind**: static class of <code>[FeedbackFunctions](#module_FeedbackFunctions)</code>  
<a name="new_module_FeedbackFunctions.FeedbackFunctions_new"></a>

#### new FeedbackFunctions()
A class containing Feedback functions.
When defining a Feedback instance, the slug string must also be the name of a feedback function defined
as a static method within this class.
So, for example, given a Feedback whose slug is 'SampleFeedback', you can invoke its Feedback function as follows:

**Example**  
```js
import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
:
:
FeedbackFunctions['SampleFeedback']();
```
<a name="module_FeedbackInstance"></a>

## FeedbackInstance

* [FeedbackInstance](#module_FeedbackInstance)
    * _static_
        * [.FeedbackInstances](#module_FeedbackInstance.FeedbackInstances)
    * _inner_
        * [~FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
            * [new FeedbackInstanceCollection()](#new_module_FeedbackInstance..FeedbackInstanceCollection_new)
            * [.define(object)](#module_FeedbackInstance..FeedbackInstanceCollection+define) ⇒
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.isDefined(name)](#) ⇒ <code>boolean</code>
            * [.removeIt(name)](#)
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_FeedbackInstance.FeedbackInstances"></a>

### FeedbackInstance.FeedbackInstances
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[FeedbackInstance](#module_FeedbackInstance)</code>  
<a name="module_FeedbackInstance..FeedbackInstanceCollection"></a>

### FeedbackInstance~FeedbackInstanceCollection ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
Each FeedbackInstance represents one recommendation or warning for a user.

**Kind**: inner class of <code>[FeedbackInstance](#module_FeedbackInstance)</code>  
**Extends:** <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>  

* [~FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
    * [new FeedbackInstanceCollection()](#new_module_FeedbackInstance..FeedbackInstanceCollection_new)
    * [.define(object)](#module_FeedbackInstance..FeedbackInstanceCollection+define) ⇒
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.isDefined(name)](#) ⇒ <code>boolean</code>
    * [.removeIt(name)](#)
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_FeedbackInstance..FeedbackInstanceCollection_new"></a>

#### new FeedbackInstanceCollection()
Creates the FeedbackInstance collection.

<a name="module_FeedbackInstance..FeedbackInstanceCollection+define"></a>

#### feedbackInstanceCollection.define(object) ⇒
Defines a new FeedbackInstance.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the slugs or IDs cannot be resolved correctly.


| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Requires feedback, the user slug or ID, and the feedback string returned from the feedback function. |

**Example**  
```js
FeedbackInstances.define({ feedback: 'CourseRecommendationsBasedOnInterests',
                           user: 'joesmith',
                          description: 'We recommend ICS 314 based on your interest in software engineering' });
```
<a name=""></a>

#### feedbackInstanceCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### feedbackInstanceCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
<a name=""></a>

#### feedbackInstanceCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
<a name=""></a>

#### feedbackInstanceCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### feedbackInstanceCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### feedbackInstanceCollection.isDefined(name) ⇒ <code>boolean</code>
Returns true if the passed entity is in this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Returns**: <code>boolean</code> - True if name exists in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | The docID, or an object specifying a documennt. |

<a name=""></a>

#### feedbackInstanceCollection.removeIt(name)
A stricter form of remove that throws an error if the document or docID could not be found in this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | A document or docID in this collection. |

<a name=""></a>

#### feedbackInstanceCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
<a name=""></a>

#### feedbackInstanceCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### feedbackInstanceCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
<a name=""></a>

#### feedbackInstanceCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### feedbackInstanceCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_FeedbackType"></a>

## FeedbackType

* [FeedbackType](#module_FeedbackType)
    * [.FeedbackType](#module_FeedbackType.FeedbackType) : <code>Object</code>
    * [.isFeedbackType(FeedbackType)](#module_FeedbackType.isFeedbackType) ⇒ <code>boolean</code>
    * [.assertFeedbackType(feedbackType)](#module_FeedbackType.assertFeedbackType)

<a name="module_FeedbackType.FeedbackType"></a>

### FeedbackType.FeedbackType : <code>Object</code>
Provides FeedbackType.RECOMMENDATION, FeedbackType.WARNING.

**Kind**: static constant of <code>[FeedbackType](#module_FeedbackType)</code>  
<a name="module_FeedbackType.isFeedbackType"></a>

### FeedbackType.isFeedbackType(FeedbackType) ⇒ <code>boolean</code>
Predicate for determining if a string is a defined FeedbackType.

**Kind**: static method of <code>[FeedbackType](#module_FeedbackType)</code>  
**Returns**: <code>boolean</code> - True if FeedbackType is a defined FeedbackType.  

| Param | Type | Description |
| --- | --- | --- |
| FeedbackType | <code>String</code> | The FeedbackType. |

<a name="module_FeedbackType.assertFeedbackType"></a>

### FeedbackType.assertFeedbackType(feedbackType)
Ensures that feedbackType is a valid type of feedback.

**Kind**: static method of <code>[FeedbackType](#module_FeedbackType)</code>  
**Throws**:

- <code>Meteor.Error</code> If not a valid type of feedback.


| Param | Description |
| --- | --- |
| feedbackType | The feedback type. |

<a name="module_SampleFeedbacks"></a>

## SampleFeedbacks
<a name="module_SampleFeedbacks.makeSampleFeedback"></a>

### SampleFeedbacks.makeSampleFeedback() ⇒ <code>String</code>
Creates a Feedback with the slug SampleFeedback and returns its docID.

**Kind**: static method of <code>[SampleFeedbacks](#module_SampleFeedbacks)</code>  
**Returns**: <code>String</code> - The docID of the newly generated Feedback.  
<a name="module_IceProcessor"></a>

## IceProcessor

* [IceProcessor](#module_IceProcessor)
    * [.isICE(obj)](#module_IceProcessor.isICE) ⇒ <code>boolean</code>
    * [.assertICE(obj)](#module_IceProcessor.assertICE)
    * [.makeCourseICE(course, grade)](#module_IceProcessor.makeCourseICE) ⇒ <code>Object</code>
    * [.getTotalICE(docs)](#module_IceProcessor.getTotalICE) ⇒ <code>Object</code>

<a name="module_IceProcessor.isICE"></a>

### IceProcessor.isICE(obj) ⇒ <code>boolean</code>
Returns true if the object passed conforms to the ICE object specifications.
Note this does not test to see if additional fields are present.

**Kind**: static method of <code>[IceProcessor](#module_IceProcessor)</code>  
**Returns**: <code>boolean</code> - True if all fields are present and are numbers.  

| Param | Description |
| --- | --- |
| obj | The object, which must be an object with fields i, c, and e. |

<a name="module_IceProcessor.assertICE"></a>

### IceProcessor.assertICE(obj)
Throws error if obj is not an ICE object.

**Kind**: static method of <code>[IceProcessor](#module_IceProcessor)</code>  
**Throws**:

- <code>Meteor.Error</code> If obj is not ICE.


| Param | Description |
| --- | --- |
| obj | The object to be tested for ICEness. |

<a name="module_IceProcessor.makeCourseICE"></a>

### IceProcessor.makeCourseICE(course, grade) ⇒ <code>Object</code>
Returns an ICE object based upon the course slug and the passed grade.
If ICS course and an A, then return 9 competency points.
If ICE course and a B, then return 5 competency points.
Otherwise return zero points.

**Kind**: static method of <code>[IceProcessor](#module_IceProcessor)</code>  
**Returns**: <code>Object</code> - The ICE object.  

| Param | Description |
| --- | --- |
| course | The course slug. If 'other', then it's a non-ICS course. |
| grade | The grade |

<a name="module_IceProcessor.getTotalICE"></a>

### IceProcessor.getTotalICE(docs) ⇒ <code>Object</code>
Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
ICE values are counted only if verified is true.

**Kind**: static method of <code>[IceProcessor](#module_IceProcessor)</code>  
**Returns**: <code>Object</code> - The ICE object.  

| Param | Description |
| --- | --- |
| docs | An array of CourseInstance or OpportunityInstance documents. |

<a name="module_Interest"></a>

## Interest

* [Interest](#module_Interest)
    * _static_
        * [.Interests](#module_Interest.Interests)
    * _inner_
        * [~InterestCollection](#module_Interest..InterestCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new InterestCollection()](#new_module_Interest..InterestCollection_new)
            * [.define(description)](#module_Interest..InterestCollection+define) ⇒
            * [.findNames(instanceIDs)](#module_Interest..InterestCollection+findNames) ⇒ <code>Array</code>
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_Interest.Interests"></a>

### Interest.Interests
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[Interest](#module_Interest)</code>  
<a name="module_Interest..InterestCollection"></a>

### Interest~InterestCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
Represents a specific interest, such as "Software Engineering".
Note that all Interests must have an associated InterestType.

**Kind**: inner class of <code>[Interest](#module_Interest)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~InterestCollection](#module_Interest..InterestCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new InterestCollection()](#new_module_Interest..InterestCollection_new)
    * [.define(description)](#module_Interest..InterestCollection+define) ⇒
    * [.findNames(instanceIDs)](#module_Interest..InterestCollection+findNames) ⇒ <code>Array</code>
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_Interest..InterestCollection_new"></a>

#### new InterestCollection()
Creates the Interest collection.

<a name="module_Interest..InterestCollection+define"></a>

#### interestCollection.define(description) ⇒
Defines a new Interest and its associated Slug.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the interest definition includes a defined slug or undefined interestType.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, description, interestType, moreInformation. Slug must be previously undefined. InterestType must be an InterestType slug or ID. MoreInformation is optional but if supplied should be a URL. |

**Example**  
```js
Interests.define({ name: 'Software Engineering',
                   slug: 'software-engineering',
                   description: 'Methods for group development of large, high quality software systems',
                   interestType: 'cs-disciplines',
                   moreInformation: 'http://softwareengineering.com' });
```
<a name="module_Interest..InterestCollection+findNames"></a>

#### interestCollection.findNames(instanceIDs) ⇒ <code>Array</code>
Returns a list of Interest names corresponding to the passed list of Interest docIDs.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If any of the instanceIDs cannot be found.


| Param | Description |
| --- | --- |
| instanceIDs | A list of Interest docIDs. |

<a name=""></a>

#### interestCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### interestCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### interestCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### interestCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### interestCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### interestCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### interestCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### interestCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### interestCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### interestCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### interestCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
<a name=""></a>

#### interestCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
<a name=""></a>

#### interestCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### interestCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### interestCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
<a name=""></a>

#### interestCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### interestCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
<a name=""></a>

#### interestCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### interestCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[InterestCollection](#module_Interest..InterestCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_InterestType"></a>

## InterestType

* [InterestType](#module_InterestType)
    * _static_
        * [.InterestTypes](#module_InterestType.InterestTypes)
    * _inner_
        * [~InterestTypeCollection](#module_InterestType..InterestTypeCollection) ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
            * [new InterestTypeCollection()](#new_module_InterestType..InterestTypeCollection_new)
            * [.define(description)](#module_InterestType..InterestTypeCollection+define) ⇒
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_InterestType.InterestTypes"></a>

### InterestType.InterestTypes
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[InterestType](#module_InterestType)</code>  
<a name="module_InterestType..InterestTypeCollection"></a>

### InterestType~InterestTypeCollection ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
InterestTypes help organize Interests into logically related groupings such as "CS-Disciplines", "Locations", etc.

**Kind**: inner class of <code>[InterestType](#module_InterestType)</code>  
**Extends:** <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>  

* [~InterestTypeCollection](#module_InterestType..InterestTypeCollection) ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
    * [new InterestTypeCollection()](#new_module_InterestType..InterestTypeCollection_new)
    * [.define(description)](#module_InterestType..InterestTypeCollection+define) ⇒
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_InterestType..InterestTypeCollection_new"></a>

#### new InterestTypeCollection()
Creates the InterestType collection.

<a name="module_InterestType..InterestTypeCollection+define"></a>

#### interestTypeCollection.define(description) ⇒
Defines a new InterestType with its name, slug, and description.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Overrides:** <code>[define](#module_Base--module.exportsType..BaseTypeCollection+define)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug already exists.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, and description. Slug must be globally unique and previously undefined. |

**Example**  
```js
InterestTypes.define({ name: 'Locations', slug: 'locations', description: 'Regions of interest.' });
```
<a name=""></a>

#### interestTypeCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### interestTypeCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### interestTypeCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### interestTypeCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### interestTypeCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### interestTypeCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the document associated with the passed slug.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>Object</code> - The document.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an
instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### interestTypeCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slugID associated with this docID.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>String</code> - The slug  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### interestTypeCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### interestTypeCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### interestTypeCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
<a name=""></a>

#### interestTypeCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
<a name=""></a>

#### interestTypeCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### interestTypeCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### interestTypeCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
<a name=""></a>

#### interestTypeCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### interestTypeCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
<a name=""></a>

#### interestTypeCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### interestTypeCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[InterestTypeCollection](#module_InterestType..InterestTypeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_SampleInterests"></a>

## SampleInterests

* [SampleInterests](#module_SampleInterests)
    * [.makeSampleInterestType()](#module_SampleInterests.makeSampleInterestType) ⇒ <code>String</code>
    * [.makeSampleInterest()](#module_SampleInterests.makeSampleInterest) ⇒ <code>String</code>

<a name="module_SampleInterests.makeSampleInterestType"></a>

### SampleInterests.makeSampleInterestType() ⇒ <code>String</code>
Creates an InterestType with a unique slug and returns its docID.

**Kind**: static method of <code>[SampleInterests](#module_SampleInterests)</code>  
**Returns**: <code>String</code> - The docID of the newly generated InterestType.  
<a name="module_SampleInterests.makeSampleInterest"></a>

### SampleInterests.makeSampleInterest() ⇒ <code>String</code>
Creates an Interest with a unique slug and returns its docID.
Also creates a new InterestType.

**Kind**: static method of <code>[SampleInterests](#module_SampleInterests)</code>  
**Returns**: <code>String</code> - The docID for the newly generated Interest.  
<a name="module_Opportunity"></a>

## Opportunity

* [Opportunity](#module_Opportunity)
    * _static_
        * [.Opportunities](#module_Opportunity.Opportunities)
    * _inner_
        * [~OpportunityCollection](#module_Opportunity..OpportunityCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new OpportunityCollection()](#new_module_Opportunity..OpportunityCollection_new)
            * [.define(description)](#module_Opportunity..OpportunityCollection+define) ⇒
            * [.removeIt(opportunity)](#module_Opportunity..OpportunityCollection+removeIt)
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_Opportunity.Opportunities"></a>

### Opportunity.Opportunities
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[Opportunity](#module_Opportunity)</code>  
<a name="module_Opportunity..OpportunityCollection"></a>

### Opportunity~OpportunityCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
Represents an Opportunity, such as "LiveWire Internship".
To represent an Opportunity taken by a specific student in a specific semester, use OpportunityInstance.

**Kind**: inner class of <code>[Opportunity](#module_Opportunity)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~OpportunityCollection](#module_Opportunity..OpportunityCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new OpportunityCollection()](#new_module_Opportunity..OpportunityCollection_new)
    * [.define(description)](#module_Opportunity..OpportunityCollection+define) ⇒
    * [.removeIt(opportunity)](#module_Opportunity..OpportunityCollection+removeIt)
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_Opportunity..OpportunityCollection_new"></a>

#### new OpportunityCollection()
Creates the Opportunity collection.

<a name="module_Opportunity..OpportunityCollection+define"></a>

#### opportunityCollection.define(description) ⇒
Defines a new Opportunity.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the definition includes a defined slug or undefined interest, sponsor, opportunityType,
or startActive or endActive are not valid.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, description, opportunityType, sponsor, interests, startActive, and endActive. Slug must not be previously defined. OpportunityType and sponsor must be defined slugs. Interests must be a (possibly empty) array of interest slugs. Sponsor must be a User with role 'FACULTY'. ICE must be a valid ICE object. MoreInformation is optional, but if supplied should be a URL. IndependentStudy is optional and defaults to false. |

**Example**  
```js
Opportunitys.define({ name: 'ATT Hackathon 2015',
                      slug: 'hack15',
                      description: 'Programming challenge at Sacred Hearts Academy, $10,000 prize',
                      opportunityType: 'event',
                      sponsor: 'philipjohnson',
                      ice: { i: 10, c: 0, e: 10},
                      interests: ['software-engineering'],
                      startActive: moment('2015-01-12').toDate(),
                      endActive: moment('2015-02-12').toDate(),
                     moreInformation: 'http://atthackathon.com',
                    independentStudy: true});
```
<a name="module_Opportunity..OpportunityCollection+removeIt"></a>

#### opportunityCollection.removeIt(opportunity)
Removes the passed Opportunity and its associated Slug.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Overrides:** <code>[removeIt](#module_Base--module.exportsInstance..BaseInstanceCollection+removeIt)</code>  
**Throws**:

- <code>Meteor.Error</code> If opportunity is not defined or there are any OpportunityInstances associated with it.


| Param | Description |
| --- | --- |
| opportunity | The document or _id associated with this Opportunity. |

<a name=""></a>

#### opportunityCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### opportunityCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### opportunityCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### opportunityCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### opportunityCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### opportunityCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### opportunityCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### opportunityCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### opportunityCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### opportunityCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
<a name=""></a>

#### opportunityCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
<a name=""></a>

#### opportunityCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### opportunityCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### opportunityCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
<a name=""></a>

#### opportunityCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### opportunityCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
<a name=""></a>

#### opportunityCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### opportunityCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[OpportunityCollection](#module_Opportunity..OpportunityCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_OpportunityInstance"></a>

## OpportunityInstance

* [OpportunityInstance](#module_OpportunityInstance)
    * _static_
        * [.OpportunityInstances](#module_OpportunityInstance.OpportunityInstances)
    * _inner_
        * [~OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
            * [new OpportunityInstanceCollection()](#new_module_OpportunityInstance..OpportunityInstanceCollection_new)
            * [.define(description)](#module_OpportunityInstance..OpportunityInstanceCollection+define) ⇒
            * [.toString(opportunityInstanceID)](#module_OpportunityInstance..OpportunityInstanceCollection+toString) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.isDefined(name)](#) ⇒ <code>boolean</code>
            * [.removeIt(name)](#)
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_OpportunityInstance.OpportunityInstances"></a>

### OpportunityInstance.OpportunityInstances
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[OpportunityInstance](#module_OpportunityInstance)</code>  
<a name="module_OpportunityInstance..OpportunityInstanceCollection"></a>

### OpportunityInstance~OpportunityInstanceCollection ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific semester.

**Kind**: inner class of <code>[OpportunityInstance](#module_OpportunityInstance)</code>  
**Extends:** <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>  

* [~OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
    * [new OpportunityInstanceCollection()](#new_module_OpportunityInstance..OpportunityInstanceCollection_new)
    * [.define(description)](#module_OpportunityInstance..OpportunityInstanceCollection+define) ⇒
    * [.toString(opportunityInstanceID)](#module_OpportunityInstance..OpportunityInstanceCollection+toString) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.isDefined(name)](#) ⇒ <code>boolean</code>
    * [.removeIt(name)](#)
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_OpportunityInstance..OpportunityInstanceCollection_new"></a>

#### new OpportunityInstanceCollection()
Creates the OpportunityInstance collection.

<a name="module_OpportunityInstance..OpportunityInstanceCollection+define"></a>

#### opportunityInstanceCollection.define(description) ⇒
Defines a new OpportunityInstance.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Semester, opportunity, and student must be slugs or IDs. Verified defaults to false. |

**Example**  
```js
OpportunityInstances.define({ semester: 'Fall-2015',
                              opportunity: 'hack2015',
                              verified: false,
                              student: 'joesmith' });
```
<a name="module_OpportunityInstance..OpportunityInstanceCollection+toString"></a>

#### opportunityInstanceCollection.toString(opportunityInstanceID) ⇒ <code>String</code>
**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Overrides:** <code>[toString](#module_Base--module.exports..BaseCollection+toString)</code>  
**Returns**: <code>String</code> - This opportunity instance, formatted as a string.  
**Throws**:

- <code>Meteor.Error</code> If not a valid ID.


| Param | Description |
| --- | --- |
| opportunityInstanceID | The opportunity instance ID. |

<a name=""></a>

#### opportunityInstanceCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### opportunityInstanceCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
<a name=""></a>

#### opportunityInstanceCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
<a name=""></a>

#### opportunityInstanceCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### opportunityInstanceCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### opportunityInstanceCollection.isDefined(name) ⇒ <code>boolean</code>
Returns true if the passed entity is in this collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Returns**: <code>boolean</code> - True if name exists in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | The docID, or an object specifying a documennt. |

<a name=""></a>

#### opportunityInstanceCollection.removeIt(name)
A stricter form of remove that throws an error if the document or docID could not be found in this collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | A document or docID in this collection. |

<a name=""></a>

#### opportunityInstanceCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
<a name=""></a>

#### opportunityInstanceCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### opportunityInstanceCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### opportunityInstanceCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_OpportunityType"></a>

## OpportunityType

* [OpportunityType](#module_OpportunityType)
    * _static_
        * [.OpportunityTypes](#module_OpportunityType.OpportunityTypes)
    * _inner_
        * [~OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection) ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
            * [new OpportunityTypeCollection()](#new_module_OpportunityType..OpportunityTypeCollection_new)
            * [.define(description)](#module_OpportunityType..OpportunityTypeCollection+define) ⇒
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_OpportunityType.OpportunityTypes"></a>

### OpportunityType.OpportunityTypes
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[OpportunityType](#module_OpportunityType)</code>  
<a name="module_OpportunityType..OpportunityTypeCollection"></a>

### OpportunityType~OpportunityTypeCollection ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
OpportunityTypes help organize Opportunities into logically related groupings such as "Internships", "Clubs", etc.

**Kind**: inner class of <code>[OpportunityType](#module_OpportunityType)</code>  
**Extends:** <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>  

* [~OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection) ⇐ <code>[BaseTypeCollection](#new_module_Base--module.exportsType..BaseTypeCollection_new)</code>
    * [new OpportunityTypeCollection()](#new_module_OpportunityType..OpportunityTypeCollection_new)
    * [.define(description)](#module_OpportunityType..OpportunityTypeCollection+define) ⇒
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_OpportunityType..OpportunityTypeCollection_new"></a>

#### new OpportunityTypeCollection()
Creates the OpportunityType collection.

<a name="module_OpportunityType..OpportunityTypeCollection+define"></a>

#### opportunityTypeCollection.define(description) ⇒
Defines a new OpportunityType with its name, slug, and description.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Overrides:** <code>[define](#module_Base--module.exportsType..BaseTypeCollection+define)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug already exists.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys name, slug, and description. Slug must be globally unique and previously undefined. |

**Example**  
```js
OpportunityTypes.define({ name: 'Research', slug: 'research', description: 'A research project.' });
```
<a name=""></a>

#### opportunityTypeCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### opportunityTypeCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### opportunityTypeCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### opportunityTypeCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### opportunityTypeCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### opportunityTypeCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the document associated with the passed slug.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>Object</code> - The document.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an
instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### opportunityTypeCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slugID associated with this docID.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>String</code> - The slug  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### opportunityTypeCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### opportunityTypeCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### opportunityTypeCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
<a name=""></a>

#### opportunityTypeCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
<a name=""></a>

#### opportunityTypeCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### opportunityTypeCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### opportunityTypeCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
<a name=""></a>

#### opportunityTypeCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### opportunityTypeCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
<a name=""></a>

#### opportunityTypeCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### opportunityTypeCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_SampleOpportunities"></a>

## SampleOpportunities

* [SampleOpportunities](#module_SampleOpportunities)
    * [.makeSampleOpportunityType()](#module_SampleOpportunities.makeSampleOpportunityType) ⇒ <code>String</code>
    * [.makeSampleOpportunity(sponsor)](#module_SampleOpportunities.makeSampleOpportunity) ⇒ <code>String</code>
    * [.makeSampleOpportunityInstance(student, sponsor)](#module_SampleOpportunities.makeSampleOpportunityInstance)

<a name="module_SampleOpportunities.makeSampleOpportunityType"></a>

### SampleOpportunities.makeSampleOpportunityType() ⇒ <code>String</code>
Creates an OpportunityType with a unique slug and returns its docID.

**Kind**: static method of <code>[SampleOpportunities](#module_SampleOpportunities)</code>  
**Returns**: <code>String</code> - The docID of the newly generated OpportunityType.  
<a name="module_SampleOpportunities.makeSampleOpportunity"></a>

### SampleOpportunities.makeSampleOpportunity(sponsor) ⇒ <code>String</code>
Creates an Opportunity with a unique slug and returns its docID.

**Kind**: static method of <code>[SampleOpportunities](#module_SampleOpportunities)</code>  
**Returns**: <code>String</code> - The docID for the newly generated Opportunity.  

| Param | Description |
| --- | --- |
| sponsor | The slug for the user (with Role.FACULTY) to be the sponsor for this opportunity. Also creates a new OpportunityType. |

<a name="module_SampleOpportunities.makeSampleOpportunityInstance"></a>

### SampleOpportunities.makeSampleOpportunityInstance(student, sponsor)
Creates an OpportunityInstance with a unique slug and returns its docID.

**Kind**: static method of <code>[SampleOpportunities](#module_SampleOpportunities)</code>  

| Param | Description |
| --- | --- |
| student | The slug for the user (with ROLE.STUDENT) who is taking advantage of this opportunity. |
| sponsor | The slug for the user (with ROLE.FACULTY) who is sponsoring the opportunity. Implicitly creates an Opportunity and an OpportunityType. |

<a name="module_Role"></a>

## Role

* [Role](#module_Role)
    * [.ROLE](#module_Role.ROLE) : <code>Object</code>
    * [.isRole(role)](#module_Role.isRole) ⇒ <code>boolean</code>
    * [.assertRole(role)](#module_Role.assertRole)

<a name="module_Role.ROLE"></a>

### Role.ROLE : <code>Object</code>
ROLE Provides ROLE.FACULTY, ROLE.STUDENT, ROLE.ADMIN, ROLE.ALUMNI.

**Kind**: static constant of <code>[Role](#module_Role)</code>  
<a name="module_Role.isRole"></a>

### Role.isRole(role) ⇒ <code>boolean</code>
Predicate for determining if a string is a defined ROLE.

**Kind**: static method of <code>[Role](#module_Role)</code>  
**Returns**: <code>boolean</code> - True if role is a defined ROLE.  

| Param | Type | Description |
| --- | --- | --- |
| role | <code>String</code> | The role. |

<a name="module_Role.assertRole"></a>

### Role.assertRole(role)
Ensures that role is a valid role.

**Kind**: static method of <code>[Role](#module_Role)</code>  
**Throws**:

- <code>Meteor.Error</code> If role is not a valid role.


| Param | Description |
| --- | --- |
| role | The role. |

<a name="module_Semester"></a>

## Semester

* [Semester](#module_Semester)
    * _static_
        * [.Semesters](#module_Semester.Semesters)
    * _inner_
        * [~SemesterCollection](#module_Semester..SemesterCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new SemesterCollection()](#new_module_Semester..SemesterCollection_new)
            * [.define(Object)](#module_Semester..SemesterCollection+define) ⇒
            * [.assertSemester(semester)](#module_Semester..SemesterCollection+assertSemester)
            * [.toString(semesterID, nospace)](#module_Semester..SemesterCollection+toString) ⇒ <code>String</code>
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.removeIt(instance)](#)
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_Semester.Semesters"></a>

### Semester.Semesters
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[Semester](#module_Semester)</code>  
<a name="module_Semester..SemesterCollection"></a>

### Semester~SemesterCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
Represents a specific semester, such as "Spring, 2016", "Fall, 2017", or "Summer, 2015".

**Kind**: inner class of <code>[Semester](#module_Semester)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~SemesterCollection](#module_Semester..SemesterCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new SemesterCollection()](#new_module_Semester..SemesterCollection_new)
    * [.define(Object)](#module_Semester..SemesterCollection+define) ⇒
    * [.assertSemester(semester)](#module_Semester..SemesterCollection+assertSemester)
    * [.toString(semesterID, nospace)](#module_Semester..SemesterCollection+toString) ⇒ <code>String</code>
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.removeIt(instance)](#)
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_Semester..SemesterCollection_new"></a>

#### new SemesterCollection()
Creates the Semester collection.

<a name="module_Semester..SemesterCollection+define"></a>

#### semesterCollection.define(Object) ⇒
Retrieves the docID for the specified Semester, or defines it if not yet present.
Implicitly defines the corresponding slug: Spring, 2016 semester is "Spring-2016".

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: The docID for this semester instance.  
**Throws**:

- <code>Meteor.Error</code> If the term or year are not correctly specified.


| Param | Type | Description |
| --- | --- | --- |
| Object | <code>Object</code> | with keys term, semester. Term must be one of Semesters.FALL, Semesters.SPRING, or Semesters.SUMMER. Year must be between 1990 and 2050. |

**Example**  
```js
Semesters.define({ term: Semesters.FALL, year: 2015 });
```
<a name="module_Semester..SemesterCollection+assertSemester"></a>

#### semesterCollection.assertSemester(semester)
Ensures the passed object is a Semester instance.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If semester is not a Semester.


| Param | Description |
| --- | --- |
| semester | Should be a defined semesterID or semester doc. |

<a name="module_Semester..SemesterCollection+toString"></a>

#### semesterCollection.toString(semesterID, nospace) ⇒ <code>String</code>
Returns the passed semester, formatted as a string.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Overrides:** <code>[toString](#)</code>  
**Returns**: <code>String</code> - The semester as a string.  

| Param | Description |
| --- | --- |
| semesterID | The semester. |
| nospace | If true, then term and year are concatenated without a space in between. |

<a name=""></a>

#### semesterCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### semesterCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### semesterCollection.removeIt(instance)
Removes the passed instance from its collection.
Also removes the associated Slug.
Note that prior to calling this method, the subclass should do additional checks to see if any dependent
objects have been deleted.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the instance (and its associated slug) cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or slug representing the instance. |

<a name=""></a>

#### semesterCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### semesterCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### semesterCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### semesterCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### semesterCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### semesterCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### semesterCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### semesterCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
<a name=""></a>

#### semesterCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
<a name=""></a>

#### semesterCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### semesterCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### semesterCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
<a name=""></a>

#### semesterCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### semesterCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### semesterCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[SemesterCollection](#module_Semester..SemesterCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_Slug"></a>

## Slug

* [Slug](#module_Slug)
    * _static_
        * [.Slugs](#module_Slug.Slugs)
    * _inner_
        * [~SlugCollection](#module_Slug..SlugCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
            * [new SlugCollection()](#new_module_Slug..SlugCollection_new)
            * [.define(name, entityName)](#module_Slug..SlugCollection+define) ⇒ <code>String</code>
            * [.updateEntityID(slugID, entityID)](#module_Slug..SlugCollection+updateEntityID)
            * [.getEntityID(slugName, entityName)](#module_Slug..SlugCollection+getEntityID) ⇒ <code>String</code>
            * [.isSlugForEntity(slugName, entityName)](#module_Slug..SlugCollection+isSlugForEntity) ⇒
            * [.hasSlug(slugID)](#module_Slug..SlugCollection+hasSlug) ⇒ <code>boolean</code>
            * [.removeIt(docOrID)](#module_Slug..SlugCollection+removeIt)
            * [.assertSlug(slugName)](#module_Slug..SlugCollection+assertSlug)
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.isDefined(name)](#) ⇒ <code>boolean</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_Slug.Slugs"></a>

### Slug.Slugs
Provides the singleton instance of a SlugCollection to all other entities.

**Kind**: static constant of <code>[Slug](#module_Slug)</code>  
<a name="module_Slug..SlugCollection"></a>

### Slug~SlugCollection ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
Slugs are unique strings that can be used to identify entities and can be used in URLs.

**Kind**: inner class of <code>[Slug](#module_Slug)</code>  
**Extends:** <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>  

* [~SlugCollection](#module_Slug..SlugCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
    * [new SlugCollection()](#new_module_Slug..SlugCollection_new)
    * [.define(name, entityName)](#module_Slug..SlugCollection+define) ⇒ <code>String</code>
    * [.updateEntityID(slugID, entityID)](#module_Slug..SlugCollection+updateEntityID)
    * [.getEntityID(slugName, entityName)](#module_Slug..SlugCollection+getEntityID) ⇒ <code>String</code>
    * [.isSlugForEntity(slugName, entityName)](#module_Slug..SlugCollection+isSlugForEntity) ⇒
    * [.hasSlug(slugID)](#module_Slug..SlugCollection+hasSlug) ⇒ <code>boolean</code>
    * [.removeIt(docOrID)](#module_Slug..SlugCollection+removeIt)
    * [.assertSlug(slugName)](#module_Slug..SlugCollection+assertSlug)
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.isDefined(name)](#) ⇒ <code>boolean</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_Slug..SlugCollection_new"></a>

#### new SlugCollection()
Creates the SlugCollection.

<a name="module_Slug..SlugCollection+define"></a>

#### slugCollection.define(name, entityName) ⇒ <code>String</code>
Creates a new Slug instance and adds it to the collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>String</code> - The docID of the created Slug.  
**Throws**:

- <code>Meteor.Error</code> If the slug already exists.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the slug. Must be globally unique across all entities. |
| entityName | <code>String</code> | The entity it is associated with. |

**Example**  
```js
Slugs.define({ name: 'software-engineering', entityName: 'Interest' });
```
<a name="module_Slug..SlugCollection+updateEntityID"></a>

#### slugCollection.updateEntityID(slugID, entityID)
Updates a Slug with the docID of the associated entity.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| slugID | <code>String</code> | The docID of this Slug. |
| entityID | <code>String</code> | The docID of the entity to be associated with this Slug. |

<a name="module_Slug..SlugCollection+getEntityID"></a>

#### slugCollection.getEntityID(slugName, entityName) ⇒ <code>String</code>
Returns the docID of the entity associated with this Slug.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>String</code> - The docID of the entity.  
**Throws**:

- <code>Meteor.Error</code> If the slug or entity cannot be found or is the wrong type.


| Param | Type | Description |
| --- | --- | --- |
| slugName | <code>String</code> | The slug name or docID. |
| entityName | <code>String</code> | The entity type expected. |

<a name="module_Slug..SlugCollection+isSlugForEntity"></a>

#### slugCollection.isSlugForEntity(slugName, entityName) ⇒
Returns true if slugName is a slug and is defined for the entity.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: True if slugName is defined for entityName.  

| Param | Description |
| --- | --- |
| slugName | The slug name. |
| entityName | The entity for which this might be a defined slug. |

<a name="module_Slug..SlugCollection+hasSlug"></a>

#### slugCollection.hasSlug(slugID) ⇒ <code>boolean</code>
Returns true if the passed slugID is defined in this collection.
In the case of SlugCollection, hasSlug is a synonym for isDefined, and you should use isDefined instead.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>boolean</code> - True if the slugID is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slugID | <code>String</code> | A docID. |

<a name="module_Slug..SlugCollection+removeIt"></a>

#### slugCollection.removeIt(docOrID)
A stricter form of remove that throws an error if the document or docID could not be found in this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Overrides:** <code>[removeIt](#module_Base--module.exports..BaseCollection+removeIt)</code>  

| Param | Type | Description |
| --- | --- | --- |
| docOrID | <code>String</code> &#124; <code>Object</code> | A document or docID in this collection. |

<a name="module_Slug..SlugCollection+assertSlug"></a>

#### slugCollection.assertSlug(slugName)
Throws an Error if the passed slugName is not a slugName.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the passed slugName is not a slug name.


| Param | Description |
| --- | --- |
| slugName | The SlugName |

<a name=""></a>

#### slugCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### slugCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
<a name=""></a>

#### slugCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
<a name=""></a>

#### slugCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### slugCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### slugCollection.isDefined(name) ⇒ <code>boolean</code>
Returns true if the passed entity is in this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>boolean</code> - True if name exists in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | The docID, or an object specifying a documennt. |

<a name=""></a>

#### slugCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
<a name=""></a>

#### slugCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### slugCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
<a name=""></a>

#### slugCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### slugCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[SlugCollection](#module_Slug..SlugCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_StarProcessor"></a>

## StarProcessor

* [StarProcessor](#module_StarProcessor)
    * _static_
        * [.processStarCsvData(student, csvData)](#module_StarProcessor.processStarCsvData) ⇒ <code>Array</code>
    * _inner_
        * [~findSemesterSlug(semester)](#module_StarProcessor..findSemesterSlug) ⇒ <code>String</code>
        * [~findCourseSlug(starDataObject)](#module_StarProcessor..findCourseSlug) ⇒ <code>String</code>
        * [~makeCourseInstanceObject(starDataObject)](#module_StarProcessor..makeCourseInstanceObject) ⇒ <code>Object</code>
        * [~filterParsedData(parsedData)](#module_StarProcessor..filterParsedData) ⇒ <code>Array</code>

<a name="module_StarProcessor.processStarCsvData"></a>

### StarProcessor.processStarCsvData(student, csvData) ⇒ <code>Array</code>
Processes STAR CSV data and returns an array of objects containing CourseInstance fields.

**Kind**: static method of <code>[StarProcessor](#module_StarProcessor)</code>  
**Returns**: <code>Array</code> - A list of objects with fields: semester, course, note, verified, grade, and creditHrs.  

| Param | Type | Description |
| --- | --- | --- |
| student | <code>String</code> | The slug of the student corresponding to this STAR data. |
| csvData | <code>String</code> | A string containing the contents of a CSV file downloaded from STAR. |

<a name="module_StarProcessor..findSemesterSlug"></a>

### StarProcessor~findSemesterSlug(semester) ⇒ <code>String</code>
Given the semester string from STAR (for example, 'Fall 2015 ext'), parses it, defines the corresponding semester,
and returns the Semester slug.

**Kind**: inner method of <code>[StarProcessor](#module_StarProcessor)</code>  
**Returns**: <code>String</code> - The RadGrad semester slug.  
**Throws**:

- Meteor.Error If parsing fails.


| Param | Description |
| --- | --- |
| semester | The STAR semester string. |

<a name="module_StarProcessor..findCourseSlug"></a>

### StarProcessor~findCourseSlug(starDataObject) ⇒ <code>String</code>
Returns the course slug, which is either an ICS course or 'other.

**Kind**: inner method of <code>[StarProcessor](#module_StarProcessor)</code>  
**Returns**: <code>String</code> - The slug.  

| Param | Description |
| --- | --- |
| starDataObject | The data object. |

<a name="module_StarProcessor..makeCourseInstanceObject"></a>

### StarProcessor~makeCourseInstanceObject(starDataObject) ⇒ <code>Object</code>
Creates a courseInstance data object from the passed arguments.

**Kind**: inner method of <code>[StarProcessor](#module_StarProcessor)</code>  
**Returns**: <code>Object</code> - An object suitable for passing to CourseInstances.define.  

| Param | Description |
| --- | --- |
| starDataObject | STAR data. |

<a name="module_StarProcessor..filterParsedData"></a>

### StarProcessor~filterParsedData(parsedData) ⇒ <code>Array</code>
Returns an array of arrays, each containing data that can be made into CourseInstances.

**Kind**: inner method of <code>[StarProcessor](#module_StarProcessor)</code>  
**Returns**: <code>Array</code> - A new array with extraneous elements deleted.  

| Param | Description |
| --- | --- |
| parsedData | The parsedData object returned from Papa.parse. |

<a name="module_SampleUsers"></a>

## SampleUsers
<a name="module_SampleUsers.makeSampleUser"></a>

### SampleUsers.makeSampleUser() ⇒ <code>String</code>
Creates a User with a unique slug and unique email and returns its docID.
If role is not supplied, it defaults to ROLE.STUDENT.

**Kind**: static method of <code>[SampleUsers](#module_SampleUsers)</code>  
**Returns**: <code>String</code> - The docID of the newly generated User.  
<a name="module_User"></a>

## User

* [User](#module_User)
    * _static_
        * [.Users](#module_User.Users)
    * _inner_
        * [~UserCollection](#module_User..UserCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
            * [new UserCollection()](#new_module_User..UserCollection_new)
            * [.define(description)](#module_User..UserCollection+define) ⇒
            * [.removeIt(user)](#module_User..UserCollection+removeIt)
            * [.removeAllWithRole(role)](#module_User..UserCollection+removeAllWithRole)
            * [.assertInRole(userID, role)](#module_User..UserCollection+assertInRole)
            * [.getEmail(userID)](#module_User..UserCollection+getEmail) ⇒ <code>String</code> &#124; <code>undefined</code>
            * [.setUhId(userID, uhID)](#module_User..UserCollection+setUhId)
            * [.setInterestIds(userID, interestIDs)](#module_User..UserCollection+setInterestIds)
            * [.setPicture(userID, picture)](#module_User..UserCollection+setPicture)
            * [.setAboutMe(userID, aboutMe)](#module_User..UserCollection+setAboutMe)
            * [.setDesiredDegree(userID, desiredDegree)](#module_User..UserCollection+setDesiredDegree)
            * [.setSemesterId(userID, semesterID)](#module_User..UserCollection+setSemesterId)
            * [.getTotalICE(studentID)](#module_User..UserCollection+getTotalICE)
            * [.getCourseIDs(studentID)](#module_User..UserCollection+getCourseIDs)
            * [.getID(instance)](#) ⇒ <code>String</code>
            * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
            * [.isDefined(instance)](#) ⇒ <code>boolean</code>
            * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
            * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
            * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
            * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
            * [.findSlugByID(docID)](#) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.toString()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_User.Users"></a>

### User.Users
Provides the singleton instance of this class to other entities.

**Kind**: static constant of <code>[User](#module_User)</code>  
<a name="module_User..UserCollection"></a>

### User~UserCollection ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
Represent a user. Users are students, admins, faculty, and alumni.

**Kind**: inner class of <code>[User](#module_User)</code>  
**Extends:** <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>  

* [~UserCollection](#module_User..UserCollection) ⇐ <code>[BaseInstanceCollection](#module_Base--module.exportsInstance..BaseInstanceCollection)</code>
    * [new UserCollection()](#new_module_User..UserCollection_new)
    * [.define(description)](#module_User..UserCollection+define) ⇒
    * [.removeIt(user)](#module_User..UserCollection+removeIt)
    * [.removeAllWithRole(role)](#module_User..UserCollection+removeAllWithRole)
    * [.assertInRole(userID, role)](#module_User..UserCollection+assertInRole)
    * [.getEmail(userID)](#module_User..UserCollection+getEmail) ⇒ <code>String</code> &#124; <code>undefined</code>
    * [.setUhId(userID, uhID)](#module_User..UserCollection+setUhId)
    * [.setInterestIds(userID, interestIDs)](#module_User..UserCollection+setInterestIds)
    * [.setPicture(userID, picture)](#module_User..UserCollection+setPicture)
    * [.setAboutMe(userID, aboutMe)](#module_User..UserCollection+setAboutMe)
    * [.setDesiredDegree(userID, desiredDegree)](#module_User..UserCollection+setDesiredDegree)
    * [.setSemesterId(userID, semesterID)](#module_User..UserCollection+setSemesterId)
    * [.getTotalICE(studentID)](#module_User..UserCollection+getTotalICE)
    * [.getCourseIDs(studentID)](#module_User..UserCollection+getCourseIDs)
    * [.getID(instance)](#) ⇒ <code>String</code>
    * [.getIDs(instances)](#) ⇒ <code>Array.&lt;String&gt;</code>
    * [.isDefined(instance)](#) ⇒ <code>boolean</code>
    * [.hasSlug(slug)](#) ⇒ <code>boolean</code>
    * [.findIdBySlug(slug)](#) ⇒ <code>String</code>
    * [.findIdsBySlugs(slugs)](#) ⇒ <code>Array</code>
    * [.findDocBySlug(slug)](#) ⇒ <code>Object</code>
    * [.findSlugByID(docID)](#) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.toString()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_User..UserCollection_new"></a>

#### new UserCollection()
Creates the User collection.

<a name="module_User..UserCollection+define"></a>

#### userCollection.define(description) ⇒
Defines a new User and their required data.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If the interest definition includes a defined slug or undefined interestType.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Object with keys firstName, lastName, slug, email, role, and password. slug must be previously undefined. role must be a defined role. |

**Example**  
```js
Users.define({ firstName: 'Joe',
               lastName: 'Smith',
               slug: 'joesmith',
               email: 'smith@hawaii.edu',
               role: ROLE.STUDENT,
               password: 'foo' });
```
<a name="module_User..UserCollection+removeIt"></a>

#### userCollection.removeIt(user)
Removes the user and their associated DegreePlan (if present) and their Slug.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Overrides:** <code>[removeIt](#module_Base--module.exportsInstance..BaseInstanceCollection+removeIt)</code>  
**Throws**:

- <code>Meteor.Error</code> if the user or their slug is not defined, or if they are referenced in Opportunities.


| Param | Description |
| --- | --- |
| user | The object or docID representing this user. |

<a name="module_User..UserCollection+removeAllWithRole"></a>

#### userCollection.removeAllWithRole(role)
Remove all users with the associated role.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the role is not a defined role.


| Param | Description |
| --- | --- |
| role | The role. |

<a name="module_User..UserCollection+assertInRole"></a>

#### userCollection.assertInRole(userID, role)
Asserts that the passed user has the given role.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If the user does not have the role, or if user or role is not valid.


| Param | Description |
| --- | --- |
| userID | The user. |
| role | The role. |

<a name="module_User..UserCollection+getEmail"></a>

#### userCollection.getEmail(userID) ⇒ <code>String</code> &#124; <code>undefined</code>
**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>String</code> &#124; <code>undefined</code> - The user's email as a string, or undefined if not published.  
**Throws**:

- <code>Meteor.Error</code> If userID is not a user ID.


| Param | Description |
| --- | --- |
| userID | The userID. |

<a name="module_User..UserCollection+setUhId"></a>

#### userCollection.setUhId(userID, uhID)
Updates userID with UH ID.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID, or if uhID is not a string.


| Param | Description |
| --- | --- |
| userID | The userID. |
| uhID | The UH ID number, as a string. |

<a name="module_User..UserCollection+setInterestIds"></a>

#### userCollection.setInterestIds(userID, interestIDs)
Updates userID with an array of interestIDs.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID, or if interestIDs is not a list of interestID.


| Param | Description |
| --- | --- |
| userID | The userID. |
| interestIDs | A list of interestIDs. |

<a name="module_User..UserCollection+setPicture"></a>

#### userCollection.setPicture(userID, picture)
Updates userID with picture.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID, or if picture is not a string.


| Param | Description |
| --- | --- |
| userID | The userID. |
| picture | The user's picture as a URL string. |

<a name="module_User..UserCollection+setAboutMe"></a>

#### userCollection.setAboutMe(userID, aboutMe)
Updates userID with AboutMe string.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID, or if aboutMe is not a string.


| Param | Description |
| --- | --- |
| userID | The userID. |
| aboutMe | The aboutMe string in markdown format. |

<a name="module_User..UserCollection+setDesiredDegree"></a>

#### userCollection.setDesiredDegree(userID, desiredDegree)
Updates userID with desiredDegree string.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID, or if desiredDegree is not a string.


| Param | Description |
| --- | --- |
| userID | The userID. |
| desiredDegree | The desired degree string. |

<a name="module_User..UserCollection+setSemesterId"></a>

#### userCollection.setSemesterId(userID, semesterID)
Updates userID with a graduation SemesterID.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID, or if semesterID is not a semesterID.


| Param | Description |
| --- | --- |
| userID | The userID. |
| semesterID | The semesterID. |

<a name="module_User..UserCollection+getTotalICE"></a>

#### userCollection.getTotalICE(studentID)
Returns an ICE object with the total of verified course and opportunity instance ICE values.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If userID is not a userID.


| Param | Description |
| --- | --- |
| studentID | The userID. |

<a name="module_User..UserCollection+getCourseIDs"></a>

#### userCollection.getCourseIDs(studentID)
Returns an array of courseIDs that this user has taken (or plans to take) based on their courseInstances.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  

| Param | Description |
| --- | --- |
| studentID | The studentID. |

<a name=""></a>

#### userCollection.getID(instance) ⇒ <code>String</code>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>String</code> - The docID associated with instance.  
**Throws**:

- <code>Meteor.Error</code> If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | Either a valid docID or a valid slug string. |

<a name=""></a>

#### userCollection.getIDs(instances) ⇒ <code>Array.&lt;String&gt;</code>
Returns the docIDs associated with instances, or throws an error if any cannot be found.
If an instance is a docID, then it is returned unchanged. If a slug, its corresponding docID is returned.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - The docIDs associated with instances.  
**Throws**:

- <code>Meteor.Error</code> If any instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instances | <code>Array.&lt;String&gt;</code> | An array of valid docIDs, slugs, or a combination. |

<a name=""></a>

#### userCollection.isDefined(instance) ⇒ <code>boolean</code>
Return true if instance is a docID or a slug for this entity.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>boolean</code> - True if instance is a docID or slug for this entity.  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>String</code> | A docID or a slug. |

<a name=""></a>

#### userCollection.hasSlug(slug) ⇒ <code>boolean</code>
Returns true if the passed slug is associated with an entity of this type.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>boolean</code> - True if the slug is in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | Either the name of a slug or a slugID. |

<a name=""></a>

#### userCollection.findIdBySlug(slug) ⇒ <code>String</code>
Return the docID of the instance associated with this slug.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>String</code> - The docID.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### userCollection.findIdsBySlugs(slugs) ⇒ <code>Array</code>
Returns a list of docIDs associated with the instances associated with the list of slugs.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>Array</code> - A list of docIDs.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slugs | <code>Array</code> | A list or collection of slugs. |

<a name=""></a>

#### userCollection.findDocBySlug(slug) ⇒ <code>Object</code>
Returns the instance associated with the passed slug.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>Object</code> - The document representing the instance.  
**Throws**:

- <code>Meteor.Error</code> If the slug cannot be found, or is not associated with an instance in this collection.


| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug (string or docID). |

<a name=""></a>

#### userCollection.findSlugByID(docID) ⇒ <code>String</code>
Returns the slug name associated with this docID.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>String</code> - The slug name  
**Throws**:

- <code>Meteor.Error</code> If docID is not associated with this entity.


| Param | Description |
| --- | --- |
| docID | The docID |

<a name=""></a>

#### userCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### userCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
<a name=""></a>

#### userCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
<a name=""></a>

#### userCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### userCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### userCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
<a name=""></a>

#### userCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### userCollection.toString() ⇒ <code>String</code>
Returns a string representing all of the documents in this collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
<a name=""></a>

#### userCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### userCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[UserCollection](#module_User..UserCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_WorkInstance"></a>

## WorkInstance

* [WorkInstance](#module_WorkInstance)
    * _static_
        * [.WorkInstances](#module_WorkInstance.WorkInstances)
    * _inner_
        * [~WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
            * [new WorkInstanceCollection()](#new_module_WorkInstance..WorkInstanceCollection_new)
            * [.define(description)](#module_WorkInstance..WorkInstanceCollection+define) ⇒
            * [.toString(workInstanceID)](#module_WorkInstance..WorkInstanceCollection+toString) ⇒ <code>String</code>
            * [.count()](#) ⇒ <code>Number</code>
            * [.publish()](#)
            * [.subscribe()](#)
            * [.findDoc(name)](#) ⇒ <code>Object</code>
            * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
            * [.isDefined(name)](#) ⇒ <code>boolean</code>
            * [.removeIt(name)](#)
            * [.removeAll()](#)
            * [.getType()](#) ⇒ <code>String</code>
            * [.assertDefined(name)](#)
            * [.assertAllDefined(names)](#)

<a name="module_WorkInstance.WorkInstances"></a>

### WorkInstance.WorkInstances
Provides the singleton instance of this class to all other entities.

**Kind**: static constant of <code>[WorkInstance](#module_WorkInstance)</code>  
<a name="module_WorkInstance..WorkInstanceCollection"></a>

### WorkInstance~WorkInstanceCollection ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
WorkInstances indicate the number of hours a week a student worked in a semester at an outside job.

**Kind**: inner class of <code>[WorkInstance](#module_WorkInstance)</code>  
**Extends:** <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>  

* [~WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection) ⇐ <code>[BaseCollection](#new_module_Base--module.exports..BaseCollection_new)</code>
    * [new WorkInstanceCollection()](#new_module_WorkInstance..WorkInstanceCollection_new)
    * [.define(description)](#module_WorkInstance..WorkInstanceCollection+define) ⇒
    * [.toString(workInstanceID)](#module_WorkInstance..WorkInstanceCollection+toString) ⇒ <code>String</code>
    * [.count()](#) ⇒ <code>Number</code>
    * [.publish()](#)
    * [.subscribe()](#)
    * [.findDoc(name)](#) ⇒ <code>Object</code>
    * [.find(selector, options)](#) ⇒ <code>Mongo.Cursor</code>
    * [.isDefined(name)](#) ⇒ <code>boolean</code>
    * [.removeIt(name)](#)
    * [.removeAll()](#)
    * [.getType()](#) ⇒ <code>String</code>
    * [.assertDefined(name)](#)
    * [.assertAllDefined(names)](#)

<a name="new_module_WorkInstance..WorkInstanceCollection_new"></a>

#### new WorkInstanceCollection()
Creates the WorkInstance collection.

<a name="module_WorkInstance..WorkInstanceCollection+define"></a>

#### workInstanceCollection.define(description) ⇒
Defines a new WorkInstance.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Returns**: The newly created docID.  
**Throws**:

- <code>Meteor.Error</code> If semester, hrsWk, or student are not valid.


| Param | Type | Description |
| --- | --- | --- |
| description | <code>Object</code> | Requires semester, hrsWk, and student. Semester and student must be a valid slug or an instance ID. |

**Example**  
```js
WorkInstances.define({ semester: `Fall-2015',
                       hrsWk: 10,
                       student: 'joesmith' });
```
<a name="module_WorkInstance..WorkInstanceCollection+toString"></a>

#### workInstanceCollection.toString(workInstanceID) ⇒ <code>String</code>
**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Overrides:** <code>[toString](#module_Base--module.exports..BaseCollection+toString)</code>  
**Returns**: <code>String</code> - This work instance, formatted as a string.  
**Throws**:

- <code>Meteor.Error</code> If not a valid ID.


| Param | Description |
| --- | --- |
| workInstanceID | The work instance ID. |

<a name=""></a>

#### workInstanceCollection.count() ⇒ <code>Number</code>
Returns the number of documents in this collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Returns**: <code>Number</code> - The number of elements in this collection.  
<a name=""></a>

#### workInstanceCollection.publish()
Default publication method for entities.
It publishes the entire collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
<a name=""></a>

#### workInstanceCollection.subscribe()
Default subscription method for entities.
It subscribes to the entire collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
<a name=""></a>

#### workInstanceCollection.findDoc(name) ⇒ <code>Object</code>
A stricter form of findOne, in that it throws an exception if the entity isn't found in the collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Returns**: <code>Object</code> - The document associated with name.  
**Throws**:

- <code>Meteor.Error</code> If the document cannot be found.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | Either the docID, or an object selector, or the 'name' field value. |

<a name=""></a>

#### workInstanceCollection.find(selector, options) ⇒ <code>Mongo.Cursor</code>
Runs find on this collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**See**: [Meteor Docs on Mongo Find](http://docs.meteor.com/#/full/find)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>Object</code> | A MongoDB selector. |
| options | <code>Object</code> | MongoDB options. |

<a name=""></a>

#### workInstanceCollection.isDefined(name) ⇒ <code>boolean</code>
Returns true if the passed entity is in this collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Returns**: <code>boolean</code> - True if name exists in this collection.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | The docID, or an object specifying a documennt. |

<a name=""></a>

#### workInstanceCollection.removeIt(name)
A stricter form of remove that throws an error if the document or docID could not be found in this collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>Object</code> | A document or docID in this collection. |

<a name=""></a>

#### workInstanceCollection.removeAll()
Removes all elements of this collection.
Available for testing purposes only.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
<a name=""></a>

#### workInstanceCollection.getType() ⇒ <code>String</code>
Return the type of this collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Returns**: <code>String</code> - The type, as a string.  
<a name=""></a>

#### workInstanceCollection.assertDefined(name)
Verifies that the passed object is one of this collection's instances.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If not defined.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> &#124; <code>List</code> | Should be a defined ID or doc in this collection. |

<a name=""></a>

#### workInstanceCollection.assertAllDefined(names)
Verifies that the list of passed instances are all members of this collection.

**Kind**: instance method of <code>[WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection)</code>  
**Throws**:

- <code>Meteor.Error</code> If instances is not an array, or if any instance is not in this collection.


| Param | Description |
| --- | --- |
| names | Should be a list of docs and/or docIDs. |

<a name="module_CareerGoalDefinitions"></a>

## CareerGoalDefinitions
<a name="module_CareerGoalDefinitions.careerGoalDefinitions"></a>

### CareerGoalDefinitions.careerGoalDefinitions
Career Goals

**Kind**: static constant of <code>[CareerGoalDefinitions](#module_CareerGoalDefinitions)</code>  
<a name="module_CourseDefinitions"></a>

## CourseDefinitions
<a name="module_CourseDefinitions.courseDefinitions"></a>

### CourseDefinitions.courseDefinitions
Provides an array containing standard ICS course definitions: name, slug, number, description, interests, syllabus,
and moreInformation (if defined).
Interests must be previously defined.

**Kind**: static constant of <code>[CourseDefinitions](#module_CourseDefinitions)</code>  
<a name="module_InterestDefinitions"></a>

## InterestDefinitions

* [InterestDefinitions](#module_InterestDefinitions)
    * _static_
        * [.interestTypeDefinitions](#module_InterestDefinitions.interestTypeDefinitions)
        * [.interestDefinitions](#module_InterestDefinitions.interestDefinitions)
    * _inner_
        * [~csDisciplineDefinitions](#module_InterestDefinitions..csDisciplineDefinitions)
        * [~nonCsDisciplineDefinitions](#module_InterestDefinitions..nonCsDisciplineDefinitions)
        * [~technologyDefinitions](#module_InterestDefinitions..technologyDefinitions)

<a name="module_InterestDefinitions.interestTypeDefinitions"></a>

### InterestDefinitions.interestTypeDefinitions
Provides an array containing InterestType definitions.

**Kind**: static constant of <code>[InterestDefinitions](#module_InterestDefinitions)</code>  
<a name="module_InterestDefinitions.interestDefinitions"></a>

### InterestDefinitions.interestDefinitions
All interests defined in this file.

**Kind**: static constant of <code>[InterestDefinitions](#module_InterestDefinitions)</code>  
<a name="module_InterestDefinitions..csDisciplineDefinitions"></a>

### InterestDefinitions~csDisciplineDefinitions
Interests associated with the type 'CS-Disciplines'.

**Kind**: inner constant of <code>[InterestDefinitions](#module_InterestDefinitions)</code>  
<a name="module_InterestDefinitions..nonCsDisciplineDefinitions"></a>

### InterestDefinitions~nonCsDisciplineDefinitions
Interest definitions not associated with computer science.

**Kind**: inner constant of <code>[InterestDefinitions](#module_InterestDefinitions)</code>  
<a name="module_InterestDefinitions..technologyDefinitions"></a>

### InterestDefinitions~technologyDefinitions
Interests associated with a specific language, tool, or technology in computer science.

**Kind**: inner constant of <code>[InterestDefinitions](#module_InterestDefinitions)</code>  
<a name="module_LoadDefinitions"></a>

## LoadDefinitions
<a name="module_LoadDefinitions.loadDefinitions"></a>

### LoadDefinitions.loadDefinitions()
Loads all of the entity definitions in /imports/startup/server/icsdata.

**Kind**: static method of <code>[LoadDefinitions](#module_LoadDefinitions)</code>  
<a name="module_OpportunityDefinitions"></a>

## OpportunityDefinitions

* [OpportunityDefinitions](#module_OpportunityDefinitions)
    * _static_
        * [.opportunityTypeDefinitions](#module_OpportunityDefinitions.opportunityTypeDefinitions)
    * _inner_
        * [~researchOpportunityDefinitions](#module_OpportunityDefinitions..researchOpportunityDefinitions)
        * [~clubOpportunityDefinitions](#module_OpportunityDefinitions..clubOpportunityDefinitions)
        * [~eventOpportunityDefinitions](#module_OpportunityDefinitions..eventOpportunityDefinitions)

<a name="module_OpportunityDefinitions.opportunityTypeDefinitions"></a>

### OpportunityDefinitions.opportunityTypeDefinitions
Provides an array containing OpportunityType definitions.

**Kind**: static constant of <code>[OpportunityDefinitions](#module_OpportunityDefinitions)</code>  
<a name="module_OpportunityDefinitions..researchOpportunityDefinitions"></a>

### OpportunityDefinitions~researchOpportunityDefinitions
Opportunities associated with the type 'Research'.

**Kind**: inner constant of <code>[OpportunityDefinitions](#module_OpportunityDefinitions)</code>  
<a name="module_OpportunityDefinitions..clubOpportunityDefinitions"></a>

### OpportunityDefinitions~clubOpportunityDefinitions
Opportunities associated with the type 'Club'.

**Kind**: inner constant of <code>[OpportunityDefinitions](#module_OpportunityDefinitions)</code>  
<a name="module_OpportunityDefinitions..eventOpportunityDefinitions"></a>

### OpportunityDefinitions~eventOpportunityDefinitions
Opportunities associated with the type 'Event'.

**Kind**: inner constant of <code>[OpportunityDefinitions](#module_OpportunityDefinitions)</code>  
<a name="module_UserDefinitions"></a>

## UserDefinitions
<a name="module_UserDefinitions.userDefinitions"></a>

### UserDefinitions.userDefinitions
Provides an array containing User definitions.

**Kind**: static constant of <code>[UserDefinitions](#module_UserDefinitions)</code>  
