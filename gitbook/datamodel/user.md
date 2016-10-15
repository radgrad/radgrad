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
  
  * System-generated *recommendations*, such as courses or opportunities of particular relevance based upon their interests and career goals. 
 

## Alumni

An alumni is a a user who has obtained their undergraduate degree in ICS.  Alumni can still access the system and are able to act in the role mentors. 

## Faculty

Faculty are able to edit and define courses, opportunities, 