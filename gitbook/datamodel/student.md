# Student

Students are the primary focus of RadGrad, so it helps to begin explaining the data model through them.  RadGrad has a collection called "User" to manage all of the various user types (Student, Faculty, Admin, Mentor, Alumni), but the most common type of user is an undergraduate student:   

<img src="images/Student.png" width="400px">

We show both the relevant Mongo collection schemas as well as the ER diagram.  Along with less important details, RadGrad represents the following characteristics of Students:

  * Their *degree plan*, which represents their past, present, and future (i.e. planned) courses, opportunities, and outside work obligations;
  
  * Their *desired degree*, such as a B.S. in CS, or a B.A. in ICS;
  
  * Their *career goals*, such as "front end web developer", or "graduate school".  Multiple career goals are appropriate and supported.
  
  * Their professional *interests*, such as "security" or "software engineering".
  
  * System-generated *recommendations*, such as courses or opportunities of particular relevance based upon their interests and career goals. 
  
The research hypothesis underlying RadGrad is that if we can accurately model a student's degree plan, goals, and interests, then it will be possible to provide useful recommendations and tailored information about our discipline, which in turn will produce positive changes in our student's undergraduate degree experience, which will ultimately lead to more successful ICS graduates.
  
These requirements for accuracy, usefulness, positive change, and increased success create a high bar for RadGrad. All of the entities and capabilities in the system are designed with the goal of producing these outcomes.