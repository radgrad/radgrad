# Spring 2017 Usability Test Design

The goals of Spring 2017 RadGrad Usability Test are to: identify problems faced by students and advisors when using the system; collect data useful for improving the system; and determine overall satisfaction with the current design of RadGrad by these two user roles. 

This usability test will not assess users in the faculty or mentor roles.

## Test Plan: Students

**Context**: We will test the system with approximately six students. Two students will be fresh out of ICS 111, two will be around the 311 level, and two will graduate this Spring.  

To recruit these students, Philip will send email to student mailing lists offering $20 to those who will attend a 30 minute session and pointing them to a form to fill out if they want to be considered as a subject. The form will ask them:
 
 * their name and uh account
 * what ICS courses they've completed,
 * any extracurricular computer science activities they've participated in, 
 * what interests they have, 
 * what career goals they are considering, 
 * what times they can be available (from a multiple selection list), and 

Prior to the session, we will create an account for them in RadGrad, input their STAR data, and add opportunities corresponding to their extracurricular activities.  

The goal of the session is to:

  * Gather evidence as to whether they feel RadGrad would improve their engagement with the ICS degree program.
  
  * Assess if the user interface is self-explanatory, and determine what parts are non-intuitive or difficult to use.

  * Discover missing features that should be implemented.

  * Discover better ways of implementing current features.
  
All data from this study is confidential and will not be part of any published research. It is intended only to evaluate the current user interface, identify problems, and surface opportunities for improvement.

**Procedure**: Here is the structure of the evaluation session:

The student arrives at POST 307 at the scheduled time.  The student will use a RadGrad developer's laptop to access Radgrad. The laptop is connected to the CSDL projector so that all observers can easily watch what takes place.  

During the session, we will close the CSDL lab door and put paper over the door window to prevent anyone from seeing in. We do this to provide privacy to the student (since their courses and grades will be displayed at times on the screen). 

We will give the student a document indicating the goals of the study, that the data will be confidential, and that we will be using ScreenFlow to create a recording of the entire session for later review.
 
Three people will participate in a session: the student, the evaluator (Philip), and a single observer (one of the RadGrad developers).  We do not want to inhibit the subject by having too many observers. On the other hand, we want someone in addition to the evaluator to be watching to increase the likelihood that we don't miss important events.  Other developers can watch the Screenflow movie later to see what happened.

The observer will also be logged in to RadGrad as an admin. This enables the observer to make updates to the data model if necessary during the session.

Here is the sequence of activities for the test:

1. The evaluator starts up ScreenFlow, then logs the student into their RadGrad account. This takes the student to their home page. The evaluator explains that we have already entered STAR data about their courses into the system, as well as the extracurricular activities, interests, and career goals that they indicated in their form. 

2. The evaluator provides a brief overview of ICE: what it means, and how to interpret the student's ICE score in the dashboard.

3. The evaluation provides a brief overview of Levels, and points out the student's preliminary Level in the dashboard. 

4. The evaluator provides a brief orientation to the pages in the system: the home area, degree planner, explorer, and mentor space. 

5. The evaluator shows the functioning of the help pane.

6. Next, the evaluator tells the student that they have two minutes to freely roam around the system and look at anything they want. If they have any questions about what they are seeing, just ask. 

7. After the student has finished looking around, the evaluator directs them to the Degree Planner page. The evaluator and student work together to make the degree plan as complete as possible. If there are courses or opportunities in the past that need to be added, the observer can edit the data model to add them.

8. Once the degree plan appears accurate to the student, the evaluator gives them the laptop sticker associated with their level.

9. The evaluator asks the student to see if there are any additional interests or career goals they might want to add to their profile.

10. The evaluator asks the student to see if they can figure out what courses or opportunities they might want to add to their degree plan given their current interests and career goals. (Answer: go to the Interest explorer and look for courses and opportunities not in plan).

11. The evaluator asks the student to indicate three things that they liked about RadGrad.

12. The evaluator asks the student for three things that should be improved about RadGrad.
 
13. The evaluator asks the student if they would like to use RadGrad in future?

**Evaluation**: Here are some of the outcomes we hope to achieve:

* What are the critical usability errors in the system? What problems did students experience while navigating the system? What information did they overlook or never access?

* How well was RadGrad able to represent their degree experience? Are there things we have overlooked?

* How well is ICE designed? Did the point system seem to support degree planning?

* How well are the Levels designed? Did the student get a sticker appropriate to their preparation?
 
* Was the system easy to understand? Did the students have any conceptual difficulties?

* Would the students use RadGrad?

### Test Plan: Advisors

**Context**: We will one meeting with Gerald and one with a Nat Sci advisor. The goal of these evaluation sessions are to:

  * Gather evidence as to whether RadGrad will provide a faster (i.e. less time needed with students) and more effective (i.e. students get a better understanding of the ICS degree program) than the current approach. 

  * Discover missing features that should be implemented prior to initial release.

  * Discover better ways of implementing current features.
  
The advisor evaluation will take place after all student evaluations are done. 
   
**Procedure**: Here is the structure of the evaluation session:

Here is the sequence of activities:

1. One of the RadGrad developers will roleplay the part of a beginning ICS student and say they would like to learn more about the ICS degree program.  

2. The advisor logs to RadGrad with their ID. This takes them to the advisor home page.  The advisor asks the student for their student ID. We provide an ID that retrieves a beginning student's STAR data. 

3. The advisor asks the student about their interests, career goals, and and desired degree. Those are input into the system, and then the advisor runs the "Generate Template" command to fill out the student's degree plan.  The plan includes both courses and opportunities and results in a projected ICE score of 100/100/100.  All courses have a projected grade of either B or A; there should be the minimum number of A's required to get to 100.   

4. The student asks some questions: for example, what is ICS 332?  What is this internship opportunity? The idea here is to have the advisor use the interface to show the student more things about the system. 

5. The student requests some changes to the degree plan: different courses, different opportunities. The advisor makes these changes.

5. The advisor fills out an entry for the "Advisor Log". This provides a brief summary of the meeting along with whatever suggestions the advisor has for the student. 

The simulated advising session ends here, and to conclude the evaluation, we ask the advisor about whether they feel RadGrad will make advising faster and/or more effective; and their insights into what could be added or improved about RadGrad for the purpose of student advising.

**Evaluation**: Here are some of the outcomes we hope to achieve:

* What are usability problems faced by advisors when using the current version of the system? How can they be addressed?

* Do advisors find RadGrad preferable to their current approach to ICS student advising? If not, why not? What can we do about that?



