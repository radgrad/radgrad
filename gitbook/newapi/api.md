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
<dt><a href="#module_AcademicPlan">AcademicPlan</a></dt>
<dd></dd>
<dt><a href="#module_DesiredDegree">DesiredDegree</a></dt>
<dd></dd>
<dt><a href="#module_Feed">Feed</a></dt>
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
<dt><a href="#module_Help">Help</a></dt>
<dd></dd>
<dt><a href="#module_IceProcessor">IceProcessor</a></dt>
<dd></dd>
<dt><a href="#module_Interest">Interest</a></dt>
<dd></dd>
<dt><a href="#module_InterestType">InterestType</a></dt>
<dd></dd>
<dt><a href="#module_SampleInterests">SampleInterests</a></dt>
<dd></dd>
<dt><a href="#module_AdvisorLog">AdvisorLog</a></dt>
<dd></dd>
<dt><a href="#module_MentorAnswers">MentorAnswers</a></dt>
<dd></dd>
<dt><a href="#module_MentorAnswers">MentorAnswers</a></dt>
<dd></dd>
<dt><a href="#module_MentorQuestions">MentorQuestions</a></dt>
<dd></dd>
<dt><a href="#module_Opportunity">Opportunity</a></dt>
<dd></dd>
<dt><a href="#module_OpportunityInstance">OpportunityInstance</a></dt>
<dd></dd>
<dt><a href="#module_OpportunityType">OpportunityType</a></dt>
<dd></dd>
<dt><a href="#module_SampleOpportunities">SampleOpportunities</a></dt>
<dd></dd>
<dt><a href="#module_Preferences">Preferences</a></dt>
<dd></dd>
<dt><a href="#module_Review">Review</a></dt>
<dd></dd>
<dt><a href="#module_Role">Role</a></dt>
<dd></dd>
<dt><a href="#module_Semester">Semester</a></dt>
<dd></dd>
<dt><a href="#module_Slug">Slug</a></dt>
<dd></dd>
<dt><a href="#module_StarDataLog">StarDataLog</a></dt>
<dd></dd>
<dt><a href="#module_StarProcessor">StarProcessor</a></dt>
<dd></dd>
<dt><a href="#module_Teaser">Teaser</a></dt>
<dd></dd>
<dt><a href="#module_SampleUsers">SampleUsers</a></dt>
<dd></dd>
<dt><a href="#module_User">User</a></dt>
<dd></dd>
<dt><a href="#module_User">User</a></dt>
<dd></dd>
<dt><a href="#module_Verification">Verification</a></dt>
<dd></dd>
<dt><a href="#module_WorkInstance">WorkInstance</a></dt>
<dd></dd>
<dt><a href="#module_AcademicYearInstance">AcademicYearInstance</a></dt>
<dd></dd>
</dl>


<br/><br/><br/>

<a id="module_Base"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Base</h5>

* [Base](#module_Base)
    * _static_
        * [.default](#module_Base.default)
    * _inner_
        * [~BaseCollection](#module_Base..BaseCollection)


<br/><br/><br/>

<a id="module_Base.default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Base.default</h5>
The BaseCollection used by all RadGrad entities.


<br/><br/><br/>

<a id="module_Base..BaseCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Base~BaseCollection</h5>
BaseCollection is an abstract superclass of all RadGrad data model entities.
It is the direct superclass for SlugCollection and SemesterCollection.
Other collection classes are derived from BaseInstanceCollection or BaseTypeCollection, which are abstract
classes that inherit from this one.


<br/><br/><br/>

<a id="module_BaseInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseInstance</h5>

* [BaseInstance](#module_BaseInstance)
    * _static_
        * [.default](#module_BaseInstance.default)
    * _inner_
        * [~BaseInstanceCollection](#module_BaseInstance..BaseInstanceCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
        * [~value(instance)](#module_BaseInstance..value) ⇒ String


<br/><br/><br/>

<a id="module_BaseInstance.default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseInstance.default</h5>
Provide this class for use by instance collections such as Interest.


<br/><br/><br/>

<a id="module_BaseInstance..BaseInstanceCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseInstance~BaseInstanceCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
BaseInstanceCollection is an abstract superclass for use by entities that have a slug.
It provides an API where the user can provide either a slug or docID (or document-specifying object).
Note it does not define a constructor; subclasses should invoke super(type, schema) to get the
BaseCollection constructor.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_BaseInstance..value"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseInstance~value(instance) ⇒ String</h5>
Returns the docID associated with instance, or throws an error if it cannot be found.
If instance is a docID, then it is returned unchanged. If instance is a slug, its corresponding docID is returned.

**Throws**:

- Meteor.Error If instance is not a docID or a slug.


| Param | Type | Description |
| --- | --- | --- |
| instance | String | Either a valid docID or a valid slug string. |

**Returns**: String - The docID associated with instance.  

<br/><br/><br/>

<a id="module_BaseType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseType</h5>

* [BaseType](#module_BaseType)
    * _static_
        * [.default](#module_BaseType.default)
    * _inner_
        * [~BaseTypeCollection](#module_BaseType..BaseTypeCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)


<br/><br/><br/>

<a id="module_BaseType.default"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseType.default</h5>
Provide this class for use by OpportunityType and TagType.


<br/><br/><br/>

<a id="module_BaseType..BaseTypeCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseType~BaseTypeCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
BaseType is an abstract superclass that factors out common code for the "type" entities: OpportunityType and TagType.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_BaseUtilities"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseUtilities</h5>

<br/><br/><br/>

<a id="module_BaseUtilities..removeAllEntities"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  BaseUtilities~removeAllEntities()</h5>
Deletes all RadGrad data model entities. (Hopefully).


<br/><br/><br/>

<a id="module_CareerGoal"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  CareerGoal</h5>

* [CareerGoal](#module_CareerGoal)
    * [~CareerGoalCollection](#module_CareerGoal..CareerGoalCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~CareerGoals](#module_CareerGoal..CareerGoals)


<br/><br/><br/>

<a id="module_CareerGoal..CareerGoalCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  CareerGoal~CareerGoalCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
CareerGoals represent the professional future(s) that the student wishes to work toward.
Note: Career Goals will probably need to be defined with a hook function that provides recommendations based upon
the specifics of the career. At that point, we'll probably need a new Base class that this class will extend.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_CareerGoal..CareerGoals"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  CareerGoal~CareerGoals</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_Course"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Course</h5>

* [Course](#module_Course)
    * [~CourseCollection](#module_Course..CourseCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Courses](#module_Course..Courses)


<br/><br/><br/>

<a id="module_Course..CourseCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Course~CourseCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents a specific course, such as "ICS 311".
To represent a specific course for a specific semester, use CourseInstance.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Course..Courses"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Course~Courses</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_CourseInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  CourseInstance</h5>

* [CourseInstance](#module_CourseInstance)
    * [~CourseInstanceCollection](#module_CourseInstance..CourseInstanceCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~CourseInstances](#module_CourseInstance..CourseInstances)


<br/><br/><br/>

<a id="module_CourseInstance..CourseInstanceCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  CourseInstance~CourseInstanceCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents the taking of a course by a specific student in a specific semester.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_CourseInstance..CourseInstances"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  CourseInstance~CourseInstances</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_SampleCourses"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleCourses</h5>

* [SampleCourses](#module_SampleCourses)
    * [~makeSampleCourse(args)](#module_SampleCourses..makeSampleCourse) ⇒ String
    * [~makeSampleCourseInstance(student, args)](#module_SampleCourses..makeSampleCourseInstance) ⇒ String


<br/><br/><br/>

<a id="module_SampleCourses..makeSampleCourse"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleCourses~makeSampleCourse(args) ⇒ String</h5>
Creates a Course with a unique slug and returns its docID.


| Param | Description |
| --- | --- |
| args | An optional object containing arguments to the courses.define function. |

**Returns**: String - The docID of the newly generated Course.  

<br/><br/><br/>

<a id="module_SampleCourses..makeSampleCourseInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleCourses~makeSampleCourseInstance(student, args) ⇒ String</h5>
Creates a CourseInstance with a unique slug and returns its docID.
Also creates a new Course.


| Param | Description |
| --- | --- |
| student | The student slug associated with this course. |
| args | Optional object providing arguments to the CourseInstance definition. |

**Returns**: String - The docID for the newly generated Interest.  

<br/><br/><br/>

<a id="module_AcademicPlan"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  AcademicPlan</h5>

<br/><br/><br/>

<a id="module_DesiredDegree"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  DesiredDegree</h5>

* [DesiredDegree](#module_DesiredDegree)
    * [~DesiredDegreeCollection](#module_DesiredDegree..DesiredDegreeCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~DesiredDegrees](#module_DesiredDegree..DesiredDegrees)


<br/><br/><br/>

<a id="module_DesiredDegree..DesiredDegreeCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  DesiredDegree~DesiredDegreeCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
DesiredDegrees specifies the set of degrees possible in this department.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_DesiredDegree..DesiredDegrees"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  DesiredDegree~DesiredDegrees</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_Feed"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Feed</h5>

* [Feed](#module_Feed)
    * [~FeedCollection](#module_Feed..FeedCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Feeds](#module_Feed..Feeds)


<br/><br/><br/>

<a id="module_Feed..FeedCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Feed~FeedCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents a feed instance.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Feed..Feeds"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Feed~Feeds</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_Feedback"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Feedback</h5>

* [Feedback](#module_Feedback)
    * [~FeedbackCollection](#module_Feedback..FeedbackCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Feedbacks](#module_Feedback..Feedbacks)


<br/><br/><br/>

<a id="module_Feedback..FeedbackCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Feedback~FeedbackCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Feedback is the generalized representation for recommendations, warnings, and (perhaps in future) predictions.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Feedback..Feedbacks"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Feedback~Feedbacks</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_FeedbackFunctions"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackFunctions</h5>

* [FeedbackFunctions](#module_FeedbackFunctions)
    * [~FeedbackFunctions](#module_FeedbackFunctions..FeedbackFunctions)
        * [new FeedbackFunctions()](#new_module_FeedbackFunctions..FeedbackFunctions_new)
    * [~FeedbackFunctions](#module_FeedbackFunctions..FeedbackFunctions) : FeedbackFunctionClass
        * [new FeedbackFunctions()](#new_module_FeedbackFunctions..FeedbackFunctions_new)


<br/><br/><br/>

<a id="module_FeedbackFunctions..FeedbackFunctions"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackFunctions~FeedbackFunctions</h5>

<br/><br/><br/>

<a id="new_module_FeedbackFunctions..FeedbackFunctions_new"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  new FeedbackFunctions()</h5>
A class containing Feedback functions. Each Feedback function is a method on the singleton instance
FeedbackFunctions.

**Example**  
```js
import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
:
:
FeedbackFunctions.recommendedCoursesThisSemesterByInterest(studentID);
```

<br/><br/><br/>

<a id="module_FeedbackFunctions..FeedbackFunctions"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackFunctions~FeedbackFunctions : FeedbackFunctionClass</h5>
Singleton instance for all FeedbackFunctions.


<br/><br/><br/>

<a id="new_module_FeedbackFunctions..FeedbackFunctions_new"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  new FeedbackFunctions()</h5>
A class containing Feedback functions. Each Feedback function is a method on the singleton instance
FeedbackFunctions.

**Example**  
```js
import { FeedbackFunctions } from '/imports/api/feedback/FeedbackFunctions';
:
:
FeedbackFunctions.recommendedCoursesThisSemesterByInterest(studentID);
```

<br/><br/><br/>

<a id="module_FeedbackInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackInstance</h5>

* [FeedbackInstance](#module_FeedbackInstance)
    * [~FeedbackInstanceCollection](#module_FeedbackInstance..FeedbackInstanceCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~FeedbackInstances](#module_FeedbackInstance..FeedbackInstances)


<br/><br/><br/>

<a id="module_FeedbackInstance..FeedbackInstanceCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackInstance~FeedbackInstanceCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Each FeedbackInstance represents one recommendation or warning for a user.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_FeedbackInstance..FeedbackInstances"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackInstance~FeedbackInstances</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_FeedbackType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackType</h5>

* [FeedbackType](#module_FeedbackType)
    * [~FeedbackType](#module_FeedbackType..FeedbackType)
    * [~isFeedbackType(FeedbackType)](#module_FeedbackType..isFeedbackType) ⇒ boolean
    * [~assertFeedbackType(feedbackType)](#module_FeedbackType..assertFeedbackType)


<br/><br/><br/>

<a id="module_FeedbackType..FeedbackType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackType~FeedbackType</h5>
Defines the legal strings used to represent FeedbackTypes in the system.


<br/><br/><br/>

<a id="module_FeedbackType..isFeedbackType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackType~isFeedbackType(FeedbackType) ⇒ boolean</h5>
Predicate for determining if a string is a defined FeedbackType.


| Param | Type | Description |
| --- | --- | --- |
| FeedbackType | String | The FeedbackType. |

**Returns**: boolean - True if FeedbackType is a defined FeedbackType.  

<br/><br/><br/>

<a id="module_FeedbackType..assertFeedbackType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  FeedbackType~assertFeedbackType(feedbackType)</h5>
Ensures that feedbackType is a valid type of feedback.

**Throws**:

- Meteor.Error If not a valid type of feedback.


| Param | Description |
| --- | --- |
| feedbackType | The feedback type. |


<br/><br/><br/>

<a id="module_SampleFeedbacks"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleFeedbacks</h5>

<br/><br/><br/>

<a id="module_SampleFeedbacks..makeSampleFeedback"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleFeedbacks~makeSampleFeedback() ⇒ String</h5>
Creates a Feedback with the slug SampleFeedback and returns its docID.

**Returns**: String - The docID of the newly generated Feedback.  

<br/><br/><br/>

<a id="module_Help"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Help</h5>

<br/><br/><br/>

<a id="module_Help..HelpMessageCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Help~HelpMessageCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents a Help message for a RadGrad page.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_IceProcessor"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor</h5>

* [IceProcessor](#module_IceProcessor)
    * [~isICE(obj)](#module_IceProcessor..isICE) ⇒ boolean
    * [~assertICE(obj)](#module_IceProcessor..assertICE)
    * [~makeCourseICE(course, grade)](#module_IceProcessor..makeCourseICE) ⇒ Object
    * [~getTotalICE(docs)](#module_IceProcessor..getTotalICE) ⇒ Object
    * [~getPlanningICE(docs)](#module_IceProcessor..getPlanningICE) ⇒ Object
    * [~getEarnedICE(docs)](#module_IceProcessor..getEarnedICE) ⇒ Object
    * [~getProjectedICE(docs)](#module_IceProcessor..getProjectedICE) ⇒ Object


<br/><br/><br/>

<a id="module_IceProcessor..isICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~isICE(obj) ⇒ boolean</h5>
Returns true if the object passed conforms to the ICE object specifications.
Note this does not test to see if additional fields are present.


| Param | Description |
| --- | --- |
| obj | The object, which must be an object with fields i, c, and e. |

**Returns**: boolean - True if all fields are present and are numbers.  

<br/><br/><br/>

<a id="module_IceProcessor..assertICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~assertICE(obj)</h5>
Throws error if obj is not an ICE object.

**Throws**:

- Meteor.Error If obj is not ICE.


| Param | Description |
| --- | --- |
| obj | The object to be tested for ICEness. |


<br/><br/><br/>

<a id="module_IceProcessor..makeCourseICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~makeCourseICE(course, grade) ⇒ Object</h5>
Returns an ICE object based upon the course slug and the passed grade.
If ICS course and an A, then return 9 competency points.
If ICE course and a B, then return 5 competency points.
Otherwise return zero points.


| Param | Description |
| --- | --- |
| course | The course slug. If 'other', then it's a non-ICS course. |
| grade | The grade |

**Returns**: Object - The ICE object.  

<br/><br/><br/>

<a id="module_IceProcessor..getTotalICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~getTotalICE(docs) ⇒ Object</h5>
Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
ICE values are counted only if verified is true.


| Param | Description |
| --- | --- |
| docs | An array of CourseInstance or OpportunityInstance documents. |

**Returns**: Object - The ICE object.  

<br/><br/><br/>

<a id="module_IceProcessor..getPlanningICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~getPlanningICE(docs) ⇒ Object</h5>
Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
ICE values are counted.


| Param | Description |
| --- | --- |
| docs | An array of CourseInstance or OpportunityInstance documents. |

**Returns**: Object - The ICE object.  

<br/><br/><br/>

<a id="module_IceProcessor..getEarnedICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~getEarnedICE(docs) ⇒ Object</h5>
Returns an ICE object that represents the earned ICE points from the passed Course\Opportunity Instance Documents.
ICE values are counted only if verified is true.
REPLACES getTotalICE!!!


| Param | Description |
| --- | --- |
| docs | An array of CourseInstance or OpportunityInstance documents. |

**Returns**: Object - The ICE object.  

<br/><br/><br/>

<a id="module_IceProcessor..getProjectedICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  IceProcessor~getProjectedICE(docs) ⇒ Object</h5>
Returns an ICE object that represents the total ICE points from the passed Course\Opportunity Instance Documents.
ICE values are counted whether or not they are verified.
REPLACES getPlanningICE!


| Param | Description |
| --- | --- |
| docs | An array of CourseInstance or OpportunityInstance documents. |

**Returns**: Object - The ICE object.  

<br/><br/><br/>

<a id="module_Interest"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Interest</h5>

* [Interest](#module_Interest)
    * [~InterestCollection](#module_Interest..InterestCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Interests](#module_Interest..Interests)


<br/><br/><br/>

<a id="module_Interest..InterestCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Interest~InterestCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents a specific interest, such as "Software Engineering".
Note that all Interests must have an associated InterestType.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Interest..Interests"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Interest~Interests</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_InterestType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  InterestType</h5>

* [InterestType](#module_InterestType)
    * [~InterestTypeCollection](#module_InterestType..InterestTypeCollection) ⇐ [`BaseTypeCollection`](#module_BaseType..BaseTypeCollection)
    * [~InterestTypes](#module_InterestType..InterestTypes)


<br/><br/><br/>

<a id="module_InterestType..InterestTypeCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  InterestType~InterestTypeCollection ⇐ [`BaseTypeCollection`](#module_BaseType..BaseTypeCollection)</h5>
InterestTypes help organize Interests into logically related groupings such as "CS-Disciplines", "Locations", etc.

**Extends**: [`BaseTypeCollection`](#module_BaseType..BaseTypeCollection)  

<br/><br/><br/>

<a id="module_InterestType..InterestTypes"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  InterestType~InterestTypes</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_SampleInterests"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleInterests</h5>

* [SampleInterests](#module_SampleInterests)
    * [~makeSampleInterestType()](#module_SampleInterests..makeSampleInterestType) ⇒ String
    * [~makeSampleInterest()](#module_SampleInterests..makeSampleInterest) ⇒ String


<br/><br/><br/>

<a id="module_SampleInterests..makeSampleInterestType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleInterests~makeSampleInterestType() ⇒ String</h5>
Creates an InterestType with a unique slug and returns its docID.

**Returns**: String - The docID of the newly generated InterestType.  

<br/><br/><br/>

<a id="module_SampleInterests..makeSampleInterest"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleInterests~makeSampleInterest() ⇒ String</h5>
Creates an Interest with a unique slug and returns its docID.
Also creates a new InterestType.

**Returns**: String - The docID for the newly generated Interest.  

<br/><br/><br/>

<a id="module_AdvisorLog"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  AdvisorLog</h5>

<br/><br/><br/>

<a id="module_AdvisorLog..AdvisorLogCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  AdvisorLog~AdvisorLogCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents a log of an Advisor talking to a Student.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_MentorAnswers"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorAnswers</h5>

* [MentorAnswers](#module_MentorAnswers)
    * [~MentorAnswerCollection](#module_MentorAnswers..MentorAnswerCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~MentorProfileCollection](#module_MentorAnswers..MentorProfileCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)


<br/><br/><br/>

<a id="module_MentorAnswers..MentorAnswerCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorAnswers~MentorAnswerCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents a mentor answer.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_MentorAnswers..MentorProfileCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorAnswers~MentorProfileCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents a mentor answer.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_MentorAnswers"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorAnswers</h5>

* [MentorAnswers](#module_MentorAnswers)
    * [~MentorAnswerCollection](#module_MentorAnswers..MentorAnswerCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~MentorProfileCollection](#module_MentorAnswers..MentorProfileCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)


<br/><br/><br/>

<a id="module_MentorAnswers..MentorAnswerCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorAnswers~MentorAnswerCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents a mentor answer.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_MentorAnswers..MentorProfileCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorAnswers~MentorProfileCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents a mentor answer.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_MentorQuestions"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorQuestions</h5>

<br/><br/><br/>

<a id="module_MentorQuestions..MentorQuestionCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  MentorQuestions~MentorQuestionCollection ⇐ module:Base~BaseInstanceCollection</h5>
Represents a mentor answer.

**Extends**: module:Base~BaseInstanceCollection  

<br/><br/><br/>

<a id="module_Opportunity"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Opportunity</h5>

* [Opportunity](#module_Opportunity)
    * [~OpportunityCollection](#module_Opportunity..OpportunityCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Opportunities](#module_Opportunity..Opportunities)


<br/><br/><br/>

<a id="module_Opportunity..OpportunityCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Opportunity~OpportunityCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents an Opportunity, such as "LiveWire Internship".
To represent an Opportunity taken by a specific student in a specific semester, use OpportunityInstance.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Opportunity..Opportunities"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Opportunity~Opportunities</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_OpportunityInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  OpportunityInstance</h5>

* [OpportunityInstance](#module_OpportunityInstance)
    * [~OpportunityInstanceCollection](#module_OpportunityInstance..OpportunityInstanceCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~OpportunityInstances](#module_OpportunityInstance..OpportunityInstances)


<br/><br/><br/>

<a id="module_OpportunityInstance..OpportunityInstanceCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  OpportunityInstance~OpportunityInstanceCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific semester.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_OpportunityInstance..OpportunityInstances"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  OpportunityInstance~OpportunityInstances</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_OpportunityType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  OpportunityType</h5>

* [OpportunityType](#module_OpportunityType)
    * [~OpportunityTypeCollection](#module_OpportunityType..OpportunityTypeCollection) ⇐ [`BaseTypeCollection`](#module_BaseType..BaseTypeCollection)
    * [~OpportunityTypes](#module_OpportunityType..OpportunityTypes)


<br/><br/><br/>

<a id="module_OpportunityType..OpportunityTypeCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  OpportunityType~OpportunityTypeCollection ⇐ [`BaseTypeCollection`](#module_BaseType..BaseTypeCollection)</h5>
OpportunityTypes help organize Opportunities into logically related groupings such as "Internships", "Clubs", etc.

**Extends**: [`BaseTypeCollection`](#module_BaseType..BaseTypeCollection)  

<br/><br/><br/>

<a id="module_OpportunityType..OpportunityTypes"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  OpportunityType~OpportunityTypes</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_SampleOpportunities"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleOpportunities</h5>

* [SampleOpportunities](#module_SampleOpportunities)
    * [~makeSampleOpportunityType()](#module_SampleOpportunities..makeSampleOpportunityType) ⇒ String
    * [~makeSampleOpportunity(sponsor)](#module_SampleOpportunities..makeSampleOpportunity) ⇒ String
    * [~makeSampleOpportunityInstance(student, sponsor)](#module_SampleOpportunities..makeSampleOpportunityInstance)


<br/><br/><br/>

<a id="module_SampleOpportunities..makeSampleOpportunityType"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleOpportunities~makeSampleOpportunityType() ⇒ String</h5>
Creates an OpportunityType with a unique slug and returns its docID.

**Returns**: String - The docID of the newly generated OpportunityType.  

<br/><br/><br/>

<a id="module_SampleOpportunities..makeSampleOpportunity"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleOpportunities~makeSampleOpportunity(sponsor) ⇒ String</h5>
Creates an Opportunity with a unique slug and returns its docID.


| Param | Description |
| --- | --- |
| sponsor | The slug for the user (with Role.FACULTY) to be the sponsor for this opportunity. Also creates a new OpportunityType. |

**Returns**: String - The docID for the newly generated Opportunity.  

<br/><br/><br/>

<a id="module_SampleOpportunities..makeSampleOpportunityInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleOpportunities~makeSampleOpportunityInstance(student, sponsor)</h5>
Creates an OpportunityInstance with a unique slug and returns its docID.


| Param | Description |
| --- | --- |
| student | The slug for the user (with ROLE.STUDENT) who is taking advantage of this opportunity. |
| sponsor | The slug for the user (with ROLE.FACULTY) who is sponsoring the opportunity. Implicitly creates an Opportunity and an OpportunityType. |


<br/><br/><br/>

<a id="module_Preferences"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Preferences</h5>

<br/><br/><br/>

<a id="module_Review"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Review</h5>

* [Review](#module_Review)
    * [~ReviewCollection](#module_Review..ReviewCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Reviews](#module_Review..Reviews)


<br/><br/><br/>

<a id="module_Review..ReviewCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Review~ReviewCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents a course or opportunity student Review

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Review..Reviews"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Review~Reviews</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_Role"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Role</h5>

* [Role](#module_Role)
    * [~ROLES](#module_Role..ROLES)
    * [~isRole(role)](#module_Role..isRole) ⇒ boolean
    * [~assertRole(role)](#module_Role..assertRole)


<br/><br/><br/>

<a id="module_Role..ROLES"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Role~ROLES</h5>
Defines the legal strings used to represent roles in the system.


<br/><br/><br/>

<a id="module_Role..isRole"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Role~isRole(role) ⇒ boolean</h5>
Predicate for determining if a string is a defined ROLE.


| Param | Type | Description |
| --- | --- | --- |
| role | String | The role. |

**Returns**: boolean - True if role is a defined ROLE.  

<br/><br/><br/>

<a id="module_Role..assertRole"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Role~assertRole(role)</h5>
Ensures that role(s) are valid roles.

**Throws**:

- Meteor.Error If any of role(s) are not valid.


| Param | Description |
| --- | --- |
| role | The role or an array of roles. |


<br/><br/><br/>

<a id="module_Semester"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Semester</h5>

* [Semester](#module_Semester)
    * [~SemesterCollection](#module_Semester..SemesterCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Semesters](#module_Semester..Semesters)


<br/><br/><br/>

<a id="module_Semester..SemesterCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Semester~SemesterCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents a specific semester, such as "Spring, 2016", "Fall, 2017", or "Summer, 2015".

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Semester..Semesters"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Semester~Semesters</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_Slug"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Slug</h5>

* [Slug](#module_Slug)
    * [~SlugCollection](#module_Slug..SlugCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~Slugs](#module_Slug..Slugs)


<br/><br/><br/>

<a id="module_Slug..SlugCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Slug~SlugCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Slugs are unique strings that can be used to identify entities and can be used in URLs.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_Slug..Slugs"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Slug~Slugs</h5>
Provides the singleton instance of a SlugCollection to all other entities.


<br/><br/><br/>

<a id="module_StarDataLog"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarDataLog</h5>

* [StarDataLog](#module_StarDataLog)
    * [~StarDataLogCollection](#module_StarDataLog..StarDataLogCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~StarDataLogs](#module_StarDataLog..StarDataLogs) : StarDataLogCollection


<br/><br/><br/>

<a id="module_StarDataLog..StarDataLogCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarDataLog~StarDataLogCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Represents STAR data for a particular student.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_StarDataLog..StarDataLogs"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarDataLog~StarDataLogs : StarDataLogCollection</h5>
Singleton instance for export.


<br/><br/><br/>

<a id="module_StarProcessor"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarProcessor</h5>

* [StarProcessor](#module_StarProcessor)
    * [~findSemesterSlug(semester)](#module_StarProcessor..findSemesterSlug) ⇒ String
    * [~findCourseSlug(starDataObject)](#module_StarProcessor..findCourseSlug) ⇒ String
    * [~makeCourseInstanceObject(starDataObject)](#module_StarProcessor..makeCourseInstanceObject) ⇒ Object
    * [~filterParsedData(parsedData)](#module_StarProcessor..filterParsedData) ⇒ Array
    * [~processStarCsvData(student, csvData)](#module_StarProcessor..processStarCsvData) ⇒ Array


<br/><br/><br/>

<a id="module_StarProcessor..findSemesterSlug"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarProcessor~findSemesterSlug(semester) ⇒ String</h5>
Given the semester string from STAR (for example, 'Fall 2015 ext'), parses it, defines the corresponding semester,
and returns the Semester slug.

**Throws**:

- Meteor.Error If parsing fails.


| Param | Description |
| --- | --- |
| semester | The STAR semester string. |

**Returns**: String - The RadGrad semester slug.  

<br/><br/><br/>

<a id="module_StarProcessor..findCourseSlug"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarProcessor~findCourseSlug(starDataObject) ⇒ String</h5>
Returns the course slug, which is either an ICS course or 'other.


| Param | Description |
| --- | --- |
| starDataObject | The data object. |

**Returns**: String - The slug.  

<br/><br/><br/>

<a id="module_StarProcessor..makeCourseInstanceObject"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarProcessor~makeCourseInstanceObject(starDataObject) ⇒ Object</h5>
Creates a courseInstance data object from the passed arguments.


| Param | Description |
| --- | --- |
| starDataObject | STAR data. |

**Returns**: Object - An object suitable for passing to CourseInstances.define.  

<br/><br/><br/>

<a id="module_StarProcessor..filterParsedData"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarProcessor~filterParsedData(parsedData) ⇒ Array</h5>
Returns an array of arrays, each containing data that can be made into CourseInstances.


| Param | Description |
| --- | --- |
| parsedData | The parsedData object returned from Papa.parse. |

**Returns**: Array - A new array with extraneous elements deleted.  

<br/><br/><br/>

<a id="module_StarProcessor..processStarCsvData"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  StarProcessor~processStarCsvData(student, csvData) ⇒ Array</h5>
Processes STAR CSV data and returns an array of objects containing CourseInstance fields.


| Param | Type | Description |
| --- | --- | --- |
| student | String | The slug of the student corresponding to this STAR data. |
| csvData | String | A string containing the contents of a CSV file downloaded from STAR. |

**Returns**: Array - A list of objects with fields: semester, course, note, verified, grade, and creditHrs.  

<br/><br/><br/>

<a id="module_Teaser"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Teaser</h5>

* [Teaser](#module_Teaser)
    * [~TeaserCollection](#module_Teaser..TeaserCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Teasers](#module_Teaser..Teasers)


<br/><br/><br/>

<a id="module_Teaser..TeaserCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Teaser~TeaserCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represents a teaser instance, such as "ACM Webmasters".

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_Teaser..Teasers"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Teaser~Teasers</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_SampleUsers"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleUsers</h5>

<br/><br/><br/>

<a id="module_SampleUsers..makeSampleUser"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  SampleUsers~makeSampleUser() ⇒ String</h5>
Creates a User with a unique slug and unique email and returns its docID.
If role is not supplied, it defaults to ROLE.STUDENT.

**Returns**: String - The docID of the newly generated User.  

<br/><br/><br/>

<a id="module_User"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User</h5>

* [User](#module_User)
    * [~UserCollection](#module_User..UserCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Users](#module_User..Users)
    * [~ValidUserAccountCollection](#module_User..ValidUserAccountCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~ValidUserAccounts](#module_User..ValidUserAccounts)


<br/><br/><br/>

<a id="module_User..UserCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~UserCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represent a user. Users have roles: admin, advisor, alumni, faculty, student, mentor.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_User..Users"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~Users</h5>
Provides the singleton instance of this class to other entities.


<br/><br/><br/>

<a id="module_User..ValidUserAccountCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~ValidUserAccountCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represent a valid user. Users must be approved before they can be created.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_User..ValidUserAccounts"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~ValidUserAccounts</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_User"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User</h5>

* [User](#module_User)
    * [~UserCollection](#module_User..UserCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~Users](#module_User..Users)
    * [~ValidUserAccountCollection](#module_User..ValidUserAccountCollection) ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)
    * [~ValidUserAccounts](#module_User..ValidUserAccounts)


<br/><br/><br/>

<a id="module_User..UserCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~UserCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represent a user. Users have roles: admin, advisor, alumni, faculty, student, mentor.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_User..Users"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~Users</h5>
Provides the singleton instance of this class to other entities.


<br/><br/><br/>

<a id="module_User..ValidUserAccountCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~ValidUserAccountCollection ⇐ [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)</h5>
Represent a valid user. Users must be approved before they can be created.

**Extends**: [`BaseInstanceCollection`](#module_BaseInstance..BaseInstanceCollection)  

<br/><br/><br/>

<a id="module_User..ValidUserAccounts"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  User~ValidUserAccounts</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_Verification"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Verification</h5>

* [Verification](#module_Verification)
    * [~VerificationRequestCollection](#module_Verification..VerificationRequestCollection) ⇐ module:BaseInstance~BaseCollection
    * [~VerificationRequests](#module_Verification..VerificationRequests)


<br/><br/><br/>

<a id="module_Verification..VerificationRequestCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Verification~VerificationRequestCollection ⇐ module:BaseInstance~BaseCollection</h5>
Represents a Verification Request, such as "LiveWire Internship".
A student has completed an opportunity (such as an internship or project) and wants to obtain ICE Points by
having it verified.

**Extends**: module:BaseInstance~BaseCollection  

<br/><br/><br/>

<a id="module_Verification..VerificationRequests"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  Verification~VerificationRequests</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_WorkInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  WorkInstance</h5>

* [WorkInstance](#module_WorkInstance)
    * [~WorkInstanceCollection](#module_WorkInstance..WorkInstanceCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~WorkInstances](#module_WorkInstance..WorkInstances)


<br/><br/><br/>

<a id="module_WorkInstance..WorkInstanceCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  WorkInstance~WorkInstanceCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
WorkInstances indicate the number of hours a week a student worked in a semester at an outside job.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_WorkInstance..WorkInstances"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  WorkInstance~WorkInstances</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="module_AcademicYearInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  AcademicYearInstance</h5>

* [AcademicYearInstance](#module_AcademicYearInstance)
    * [~AcademicYearInstanceCollection](#module_AcademicYearInstance..AcademicYearInstanceCollection) ⇐ [`BaseCollection`](#module_Base..BaseCollection)
    * [~AcademicYearInstances](#module_AcademicYearInstance..AcademicYearInstances)


<br/><br/><br/>

<a id="module_AcademicYearInstance..AcademicYearInstanceCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  AcademicYearInstance~AcademicYearInstanceCollection ⇐ [`BaseCollection`](#module_Base..BaseCollection)</h5>
Each AcademicYearInstance represents a sequence of three semesters for a given student.
It is used to control the display of semesters for a given student in the Degree Planner.

**Extends**: [`BaseCollection`](#module_Base..BaseCollection)  

<br/><br/><br/>

<a id="module_AcademicYearInstance..AcademicYearInstances"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  AcademicYearInstance~AcademicYearInstances</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="checkPrerequisites"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  checkPrerequisites</h5>
Checks all the CourseInstances to ensure that the prerequisites are fulfilled.


<br/><br/><br/>

<a id="chooseBetween"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  chooseBetween ⇒ \*</h5>
Chooses the 'best' course to take given an array of slugs, the student and the courses the student
has taken.


| Param | Description |
| --- | --- |
| slugs | an array of course slugs to choose between. |
| studentID | the student's ID. |
| coursesTakenSlugs | an array of the course slugs the student has taken. |


<br/><br/><br/>

<a id="radgradCollections"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  radgradCollections : Array</h5>
Each RadGrad collection class instance must add itself to this array so that integrity checking and dump/restore
will work correctly.


<br/><br/><br/>

<a id="PublicStats"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  PublicStats</h5>
Provides the singleton instance of this class to all other entities.


<br/><br/><br/>

<a id="ROLE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  ROLE : Object</h5>
ROLE Provides ROLE.FACULTY, ROLE.STUDENT, ROLE.ADMIN, ROLE.ALUMNI.


<br/><br/><br/>

<a id="createNote"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createNote(slug) ⇒ string</h5>
Converts a course Slug into the capitalized note needed for CourseInstances.


| Param | Description |
| --- | --- |
| slug | the course Slug e.g. 'ics111' |

**Returns**: string - The capitalized string used in CourseInstances e.g. 'ICS 111'.  

<br/><br/><br/>

<a id="getStartingSemester"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getStartingSemester(student)</h5>
Returns the student's starting semester.  The starting semester is found by looking at CourseInstances.


| Param | Description |
| --- | --- |
| student | The student. |


<br/><br/><br/>

<a id="isCoreInstance"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  isCoreInstance(courseInstance) ⇒ boolean</h5>
Returns true if the courseInstance is a core ICS course, 111, 141, 211, 241, 314, 311.


| Param | Description |
| --- | --- |
| courseInstance | the course instance. |


<br/><br/><br/>

<a id="addOpportunities"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  addOpportunities(student, semester)</h5>
Adds ACM-Manoa and WetWare Wednesdays to the student's RadGradPlan for the given semester.


| Param |
| --- |
| student | 
| semester | 


<br/><br/><br/>

<a id="stripCounter"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  stripCounter(planChoice) ⇒ \*</h5>
Strips of the counter for the plan choice. The counter is used in academic plans to keep track of how many
choices there are (e.g. five ics400+ in the B.S. degree).


| Param | Description |
| --- | --- |
| planChoice | the plan choice. |


<br/><br/><br/>

<a id="isSingleChoice"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  isSingleChoice(planChoice) ⇒ boolean</h5>
Returns true if the planChoice is a single choice.


| Param | Description |
| --- | --- |
| planChoice | the plan choice. |


<br/><br/><br/>

<a id="isSimpleChoice"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  isSimpleChoice(planChoice) ⇒ boolean</h5>
Returns true if the plan choice is a simple choice, just individual slugs separated by commas.


| Param | Description |
| --- | --- |
| planChoice | the plan choice. |


<br/><br/><br/>

<a id="isComplexChoice"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  isComplexChoice(planChoice) ⇒ boolean</h5>
Returns true if the plan choice includes a sub-choice (e.g. '(ics313,ics331),ics355-1' )


| Param | Description |
| --- | --- |
| planChoice | the plan choice. |


<br/><br/><br/>

<a id="complexChoiceToArray"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  complexChoiceToArray(planChoice)</h5>
Converts a complex choice into an array of the slugs that make up the choice.
Note: This may not be enough to solve the generate plan problem.


| Param | Description |
| --- | --- |
| planChoice | a plan choice. |


<br/><br/><br/>

<a id="buildCourseSlugName"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  buildCourseSlugName(slug) ⇒ string</h5>
Creates the course name from the slug. Course names have department in all caps.


| Param | Description |
| --- | --- |
| slug | the course slug. |


<br/><br/><br/>

<a id="buildSimpleName"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  buildSimpleName(slug) ⇒ string</h5>
Builds the Name for a simple planChoice. Will have commas replaced by ' or '.


| Param | Description |
| --- | --- |
| slug | the simple plan choice. |


<br/><br/><br/>

<a id="getDepartments"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getDepartments(planChoice) ⇒ Array</h5>
Returns an array of the departments in the plan choice.


| Param | Description |
| --- | --- |
| planChoice | The plan choice. |


<br/><br/><br/>

<a id="satisfiesPlanChoice"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  satisfiesPlanChoice(planChoice, courseSlug)</h5>
Returns true if the courseSlug satisfies the plan choice.


| Param | Description |
| --- | --- |
| planChoice | The plan choice. |
| courseSlug | The course slug. |


<br/><br/><br/>

<a id="planIndexOf"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  planIndexOf(planChoices, courseSlug) ⇒</h5>
Returns the index of the courseSlug in the array of plan choices.


| Param | Description |
| --- | --- |
| planChoices | an array of plan choices. |
| courseSlug | the course slug. |

**Returns**: the index of courseSlug in the array.  

<br/><br/><br/>

<a id="getRestoreFileAge"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getRestoreFileAge(restoreFileName) ⇒ String</h5>
Returns a string indicating how long ago the restore file was created. Parses the file name string.


| Param | Description |
| --- | --- |
| restoreFileName | The file name. |

**Returns**: String - A string indicating how long ago the file was created.  

<br/><br/><br/>

<a id="getDefinitions"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getDefinitions(restoreJSON, collection)</h5>
Returns the definition array associated with collectionName in the restoreJSON structure.


| Param | Description |
| --- | --- |
| restoreJSON | The restore file contents. |
| collection | The collection of interest. |


<br/><br/><br/>

<a id="restoreCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  restoreCollection(collection, restoreJSON)</h5>
Given a collection and the restoreJSON structure, looks up the definitions and invokes define() on them.


| Param | Description |
| --- | --- |
| collection | The collection to be restored. |
| restoreJSON | The structure containing all of the definitions. |


<br/><br/><br/>

<a id="getStudentSemesters"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getStudentSemesters(studentID)</h5>
Returns an array of the semesterIDs that the student has taken or is planning to take courses or opportunities
in.


| Param |
| --- |
| studentID | 


<br/><br/><br/>

<a id="addBodyClass"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  addBodyClass()</h5>
Design notes:
Only one group per role. (Used to extract role from path.)
Every group must have a home page called 'home'.  (Used for redirect from landing.)


<br/><br/><br/>

<a id="documentCounts"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  documentCounts() ⇒ Array</h5>
Returns an Array of numbers, one per RadGradCollection, indicating the number of documents in that collection.

**Returns**: Array - An array of collection document counts.  

<br/><br/><br/>

<a id="totalDocuments"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  totalDocuments() ⇒ Number</h5>
Returns the total number of documents in the RadGrad database.

**Returns**: Number - The total number of RadGrad documents.  

<br/><br/><br/>

<a id="getDefinitions"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getDefinitions(restoreJSON, collection)</h5>
Returns the definition array associated with collectionName in the restoreJSON structure.


| Param | Description |
| --- | --- |
| restoreJSON | The restore file contents. |
| collection | The collection of interest. |


<br/><br/><br/>

<a id="getRestoreFileAge"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getRestoreFileAge(restoreFileName) ⇒ String</h5>
Returns a string indicating how long ago the restore file was created. Parses the file name string.


| Param | Description |
| --- | --- |
| restoreFileName | The file name. |

**Returns**: String - A string indicating how long ago the file was created.  

<br/><br/><br/>

<a id="restoreCollection"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  restoreCollection(collection, restoreJSON)</h5>
Given a collection and the restoreJSON structure, looks up the definitions and invokes define() on them.


| Param | Description |
| --- | --- |
| collection | The collection to be restored. |
| restoreJSON | The structure containing all of the definitions. |


<br/><br/><br/>

<a id="newStartupProcess"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  newStartupProcess()</h5>
If the database is empty, this function looks up the name of the restore file in the settings file,
then reads it in and calls define() on its contents in order to rebuild the RadGrad database.
Console messages are generated when the contents of the restore file does not include collections that
this function assumes are present. Conversely, if the restore file contains collections not processed with
this file, a string is also printed out.


<br/><br/><br/>

<a id="makeLink"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  makeLink(url) ⇒ string</h5>
Returns a link element for opening URL in a new tab.


| Param | Description |
| --- | --- |
| url | The URL. |

**Returns**: string - The 'a' element for opening the URL in a new tab.  

<br/><br/><br/>

<a id="getSchemaDataFromEvent"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getSchemaDataFromEvent(schema, event) ⇒ Object</h5>
Return the data from the submitted form corresponding to the fields in the passed schema.


| Param | Description |
| --- | --- |
| schema | The simple schema. |
| event | The event holding the form data. |

**Returns**: Object - An object whose keys are the schema keys and whose values are the corresponding form values.  

<br/><br/><br/>

<a id="slugFieldValidator"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  slugFieldValidator() ⇒</h5>
Custom validator for the slug field.

**Throws**:

- Error if there are no Slugs in the SlugCollection.

**Returns**: True if the slug value is not previously defined, otherwise errorType 'duplicateSlug'.  

<br/><br/><br/>

<a id="renameKey"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  renameKey(obj, oldKey, newKey)</h5>
Rename oldKey in obj to newKey.


| Param | Description |
| --- | --- |
| obj | The object containing oldKey |
| oldKey | The oldKey (a string). |
| newKey | The newKey (a string). |


<br/><br/><br/>

<a id="convertICE"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  convertICE(obj)</h5>
Convert ICE values from three fields to a single 'ice' field with an object value.


| Param | Description |
| --- | --- |
| obj | The data object holding ICE values as three separate fields. |


<br/><br/><br/>

<a id="setupFormWidget"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  setupFormWidget(instance, schema)</h5>
Add successClass, errorClass, and context to the template.


| Param | Description |
| --- | --- |
| instance | The template instance. |
| schema | The schema associated with the form in this instance. |


<br/><br/><br/>

<a id="indicateSuccess"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  indicateSuccess(instance, event)</h5>
After a form submission has completed successfully, update template state to indicate success.


| Param | Description |
| --- | --- |
| instance | The template instance. |
| event | The event holding the form data. |


<br/><br/><br/>

<a id="indicateError"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  indicateError(instance)</h5>
If a form submission was not validated, update template state to indicate error.


| Param | Description |
| --- | --- |
| instance | The template instance. |


<br/><br/><br/>

<a id="descriptionPairs"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  descriptionPairs()</h5>
Users are currently defined in two steps: an initial create with only a few fields, then a subsequent $set
to add the remaining fields. Because of this two-step process for creating users, the descriptionPairs method
will be called twice, once with a "partial" user document followed by a call with the complete user document.
To prevent descriptionPairs from calling methods like CareerGoals.findNames with the undefined value due to
the "partial" user document, the existence of a "complete" user document is checked before constructing the array.


<br/><br/><br/>

<a id="getSchemaDataFromEvent"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getSchemaDataFromEvent(schema, event) ⇒ Object</h5>
Return the data from the submitted form corresponding to the fields in the passed schema.


| Param | Description |
| --- | --- |
| schema | The simple schema. |
| event | The event holding the form data. |

**Returns**: Object - An object whose keys are the schema keys and whose values are the corresponding form values.  

<br/><br/><br/>

<a id="getRouteUserName"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getRouteUserName()</h5>
Returns the username portion of the route.
Returns the username for all routes except the landing page.


<br/><br/><br/>

<a id="click .cas-logout"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  click .cas-logout(event) ⇒ boolean</h5>
Handle the click on the logout link.


| Param | Description |
| --- | --- |
| event | The click event. |

**Returns**: boolean - False.  

<br/><br/><br/>

<a id="click .cas-login"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  click .cas-login(event) ⇒ boolean</h5>
Handle the click on the login link.


| Param | Description |
| --- | --- |
| event | The click event. |

**Returns**: boolean - False.  

<br/><br/><br/>

<a id="authInProcess"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  authInProcess() ⇒ \*</h5>
**Returns**: \* - True if Meteor is in the process of logging in.  

<br/><br/><br/>

<a id="isAuthorized"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  isAuthorized() ⇒ boolean</h5>
Determine if the user is authorized to view the current page.
If current page is the landing page, they are authorized.
If current user is an admin, they can see any page.
If current user is an advisor, they can see any student, alumni, or advisor page.
If current user is a student, they can see only their own page (student/<username>/).
If current user is a mentor, they can see only their own page (mentor/<username>).
If current user is an alumni, they can see only their own page (alumni/<username>).

**Returns**: boolean - True if there is a logged in user and they are authorized to visit the page.  

<br/><br/><br/>

<a id="getExplorerUserID"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getExplorerUserID()</h5>
Returns the explorerUserName portion of the route.


<br/><br/><br/>

<a id="getExplorerUserID"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getExplorerUserID()</h5>
Returns the explorerUserName portion of the route.


<br/><br/><br/>

<a id="getExplorerUserID"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  getExplorerUserID()</h5>
Returns the explorerUserName portion of the route.

