# User

Users are associated with one of the following roles: Student, Alumni, Faculty, Advisor, and Admin.

## Student

Students are the primary focus of RadGrad, so it helps to begin explaining the data model through them. A student is a user who is currently enrolled in ICS courses and has not yet graduated. 

<img src="images/Student.png" width="400px">

The image illustrates both the relevant Mongo collection schemas as well as the ER diagram.  Along with less important details, RadGrad represents the following characteristics of Students:

  * Their *degree plan*, which represents their past, present, and future (i.e. planned) courses, opportunities, and outside work obligations;
  
  * Their *desired degree*, such as a B.S. in CS, or a B.A. in ICS;
  
  * Their *career goals*, such as "front end web developer", or "graduate school".  Multiple career goals are appropriate and supported.
  
  * Their professional *interests*, such as "security" or "software engineering".
  
  * System-generated *recommendations and warnings*, such as courses or opportunities of particular relevance based upon their interests and career goals, or potential problems with their degree plan. 
  
The home page for a student enables them to see the status of their degree plan, goals, interests, ICS points, and so forth.
 

## Alumni

An alumni is a former student who has obtained their undergraduate degree in ICS.  Alumni can act as mentors and reply to student questions.  

The home page for an alumni provides an interface to mentorship questions and answers.  

## Faculty

Faculty are able to edit and define courses, opportunities, and so forth. 

They can also verify participation in opportunities, resulting in the award of ICE points. 

The home page for faculty enables them to perform editing and verification.

## Advisor

An advisor has all the capabilities of a Faculty member, plus the ability to upload data from STAR, and override or supplement STAR-supplied data. 

Access to RadGrad is restricted to those with a UH account who are explicitly allowed to login.  Advisors can manage the list of UH accounts authorized to login to RadGrad.

The home page for an advisors helps them to locate students, upload STAR data, and otherwise assist in the degree planning process.

## Admin

The admin role is restricted to developers. They can assign roles to users and otherwise manage the system.

The home page for admins enables them to carry out their admin duties more effectively. (How's that for vagueness.)

## Implementation

See [UserCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-User-UserCollection.html)
