# Mockup Design Evaluation

The goal of this section is to clarify the remaining development efforts for Milestone 1 by specifying how we will evaluate the RadGrad mockup. 

### Advisor role evaluation

**Context**: We will have two meetings: one with Gerald and one with Man Chon.  The goals of these evaluation sessions are to:

  * Gather evidence as to whether RadGrad will provide a faster (i.e. less time needed with students) and more effective (i.e. students get a better understanding of the ICS degree program) than the current approach. 

  * Discover missing features that should be implemented prior to initial release.

  * Discover better ways of implementing current features.
   
**Procedure**: Here is the structure of the evaluation session:

First, the advisor watches a short 2-3 minute video called "Introduction to RadGrad for Advisors". This video explains the goals of RadGrad in general, the specific features it provides for advisors, and an overview of the user interface.

Now a "simulated advising session" begins. We will use screenflow to create a recording of the session, capturing what happens on the screen as well as what is spoken. 

Here is the sequence of activities:

1. One of the RadGrad developers will roleplay the part of a beginning ICS student and say they would like to learn more about the ICS degree program.  

2. The advisor logs to RadGrad with their ID (glau or mckuok). This takes them to the advisor home page.  The advisor asks the student for their student ID. We provide an ID that retrieves a beginning student's STAR data. 

3. The advisor asks the student about their interests, career goals, and and desired degree. Those are input into the system, and then the advisor runs the "Generate Template" command to fill out the student's degree plan.  The plan includes both courses and opportunities and results in a projected ICE score of 100/100/100.  All courses have a projected grade of either B or A; there should be the minimum number of A's required to get to 100.   

4. The student asks some questions: for example, what is ICS 332?  What is this internship opportunity? The idea here is to have the advisor use the interface to show the student more things about the system. 

5. The student requests some changes to the degree plan: different courses, different opportunities. The advisor makes these changes.

5. The advisor fills out an entry for the "Advisor Log". This provides a brief summary of the meeting along with whatever suggestions the advisor has for the student. (Note: Each advisor log entry is time-stamped and is available within both the student and advisor interface.  Students can also make entries in the advisor log. It provides a communication channel between the advisor and the student in addition to email.)

The simulated advising session ends here, and to conclude the evaluation, we ask the advisor about whether they feel RadGrad will make advising faster and/or more effective; and their insights into what could be added or improved about RadGrad for the purpose of student advising.

**To Do**: Develop the advisor video; Add glau and mckuok to UH CAS test server; Augment the "generate template" to do ICE; Provide more details about courses (such as student reviews); Implement a mockup of the Advisor Log.

### Student role evaluation

**Context**: We will have 3-6 meetings with students. One or two will be students fresh out of ICS 111, one or two around the 311 level, and one or two will be graduating this Spring.  

To recruit these students, Philip will send email to the student mailing lists offering $20 to those who will attend a 30 minute session and pointing them to a form to fill out if they want to be considered as an evaluator. The form will ask them what courses they've completed, any extracurricular ICS activities they've participated in, what times they can be available, and their UH account name.

Prior to the session, we will add their UH account name to the UH CAS test server, and associate that user name with course and opportunity data appropriate to their current status within the ICS degree program.

The goals of these evaluation sessions are to:

  * Gather evidence as to whether they feel RadGrad would improve their engagement with the ICS degree program.
  
  * Assess if the user interface is self-explanatory, and determine what parts are non-intuitive or difficult to use.

  * Discover missing features that should be implemented prior to initial release.

  * Discover better ways of implementing current features.
  
**Procedure**: Here is the structure of the evaluation session:

First, the student watches a short 2-3 minute video called "Introduction to RadGrad for Student". This video explains the goals of RadGrad in general, the specific features it provides for students, and an overview of the user interface.

Now a simulated student interaction with the system begins. We will use screenflow to create a recording of the session, capturing what happens on the screen as well as what is spoken. 

1. The evaluator asks the student to login into RadGrad using their UH account name. This takes the student to their home page, which has simulated data based upon their form responses. 

2. The evaluator notes that the student has achieved a certain level (only Levels 1, 2, or 3). The evaluator gives the student a laptop sticker associated with their level.

3. The evaluator asks them to explore the site for a minute or so, clicking on whatever they want. We want to see what the student finds interesting at first glance, and any user interface problems they encounter.

4. The evaluator asks the student to work on their degree plan for a couple of minutes, adding courses and opportunities in order to complete their degree requirements and get to ICE of 100/100/100. We want to assess the ease of use of the degree planner, and whether ICE makes sense.

5. The evaluator asks the student what they think they need to do to get to the next Level.

6. The evaluator asks the student to try to figure out which of the courses they are taking next semester will be the hardest, or easiest, or "best". (This will hopefully lead them to look at course reviews.)

7. The evaluator asks the student to use RadGrad to find out what they need to work on now if they want to eventually get a job in Silicon Valley. (This will hopefully lead them to look at the Mentorspace area and compare/contrast the recommendations with their own current level of preparation.)
 
The simulated advising session ends here, and to conclude the evaluation, we ask the student about whether they feel RadGrad will improve their engagement with the ICS Degree Program; and their insights into what could be added or improved about RadGrad from the student perspective.

**To Do**: Develop the student video; Provide 5-6 teaser videos (make 1 minute teaser videos of Johnson, Casanova, Pavlovic, GreyHats, ACManoa, Chin, Lim); Provide simulated course evaluations; Enable UH accounts to be associated with sample profile data; Design and produce sample laptop stickers for Levels 1, 2, 3; recommendations needed for courses remaining to fulfill desired degree requirements.
