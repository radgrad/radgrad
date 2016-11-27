# Mockup Design Evaluation

The goal of this section is to clarify the remaining development efforts for Milestone 1 by specifying how we will evaluate the RadGrad mockup. 

### Advisor role evaluation

**Context**: We will have two meetings: one with Gerald and one with Man Chon.  The goals of these evaluation sessions are to:

  * Gather evidence as to whether RadGrad will provide a faster (i.e. less time needed with students) and more effective (i.e. students get a better understanding of the ICS degree program) than the current approach. 

  * Discover missing features that should be implemented prior to initial release.

  * Discover better ways of implementing current features.
   
**Procedure**: Here is the structure of the evaluation session:

First, the advisor watches a short 2-3 minute video called "Introduction to RadGrad for Advisors". This video explains the goals of RadGrad in general, the specific features it provides for advisors, and an overview of the user interface.

Now a "simulated advising session" begins with the following sequence of activities:

1. One of the RadGrad developers will roleplay the part of a beginning ICS student and say they would like to learn more about the ICS degree program.  

2. The advisor logs to RadGrad with their ID (glau or mckuok). This takes them to the advisor home page.  The advisor asks the student for their student ID. We provide an ID that retrieves a beginning student's STAR data. 

3. The advisor asks the student about their interests, career goals, and and desired degree. Those are input into the system, and then the advisor runs the "Generate Template" command to fill out the student's degree plan.  The plan includes both courses and opportunities and results in a projected ICE score of 100/100/100.  All courses have a projected grade of either B or A; there should be the minimum number of A's required to get to 100.   

4. The student asks some questions: for example, what is ICS 332?  What is this internship opportunity? The idea here is to have the advisor use the interface to show the student more things about the system. 

5. The advisor fills out an entry for the "Advisor Log". This provides a brief summary of the meeting along with whatever suggestions the advisor has for the student. (Note: Each advisor log entry is time-stamped and is available within both the student and advisor interface.  Students can also make entries in the advisor log. It provides a communication channel between the advisor and the student in addition to email.)

The simulated advising session ends here, and to conclude the evaluation, we ask the advisor about whether they feel RadGrad will make advising faster and/or more effective; and their insights into what could be added or improved about RadGrad for the purpose of student advising.

**To Do**: develop the video; add glau and mckuok to UH CAS test server; improve the "generate template" to do ICE; provide more details about courses (such as student reviews); implement the Advisor Log.

### Student role evaluation

**Context**: We will have 3-6 meetings with students. One or two will be students fresh out of ICS 111, one or two around the 311 level, and one or two will be graduating this Spring.  To recruit these students, Philip will send email to the student mailing lists offering $20 to those who will attend a 30 minute session and pointing them to a form to fill out if they want to be considered as an evaluator. The form will ask them what courses they've completed and what times they can be available.

The goals of these evaluation sessions are to:

  * Gather evidence as to whether they feel RadGrad would improve their engagement with the ICS degree program.
  
  * Assess if the user interface is self-explanatory, and determine what parts are non-intuitive or difficult to use.

  * Discover missing features that should be implemented prior to initial release.

  * Discover better ways of implementing current features.

  
**Procedure**: Here is the structure of the evaluation session:

First, the student watches a short 2-3 minute video called "Introduction to RadGrad for Student". This video explains the goals of RadGrad in general, the specific features it provides for students, and an overview of the user interface.


**To Do**: Provide 5-6 teaser videos (make videos of Johnson, Casanova, Pavlovic, GreyHats, ACManoa, Chin, Lim).




### Advisor meeting: first contact, no ICS background {#first-meeting}

*Context:* An ICS advisor is meeting with a student for the first time. The student has not yet taken any ICS courses and wants to learn about the major.
 
*Goal:* RadGrad helps the advisor learn about the student's background and interests in order to help them assess their suitability for an ICS degree.  RadGrad also helps the student learn more about ICS.

*Steps:*

1. Advisor logs into RadGrad using their UH account and password, authorizes login for student by providing student ID, UH username, first and last name. 
2. RadGrad sends an email to the student welcoming them to the system and providing them with the URL to the system and brief instructions.
2. Advisor gets Student ID number, downloads STAR data as CSV, uploads it into student's RadGrad account.
3. Advisor looks at student's course history in RadGrad, asks about the student's interests in computer science and possible career goals, and adds those to the system. 
4. Advisor picks a degree plan template from a selection offered by RadGrad based upon student interests and current courses.  RadGrad fills out the student's degree plan to show how (and when) they might graduate with an ICS degree.
5. Advisor makes notes about the meeting in RadGrad, which is saved and available to the student by logging into the system.
6. Advisor suggests that student explore the ICS degree further using RadGrad on their own time, and to come back for more consultation if they have questions.

### Advisor meeting: first contact, has ICS background {#first-meeting-ics-background}

*Context:* An ICS advisor is meeting with a student who has completed some ICS Degree requirements but has not previously used RadGrad.
 
*Goal:* RadGrad helps advisor more quickly assess the student's status.  The student learns about ways to improve their degree experience.

*Steps:*

1. Advisor logs into RadGrad using their UH account and password, authorizes login for student by providing student ID, UH username, first and last name. 
2. RadGrad sends an email to the student welcoming them to the system and providing them with the URL to the system and brief instructions.
2. Advisor gets Student ID number, downloads STAR data as CSV, uploads it into student's RadGrad account.
3. Advisor looks at student's course history in RadGrad, asks about the student's interests in computer science and possible career goals, and adds those to the system. 
4. Advisor asks student about their extracurricular ICS activities, and "backfills" opportunities from prior semesters.
5. Advisor explains ICS system and show the recommendations and warnings generated by the system.
5. Advisor makes notes about the meeting in RadGrad, which is saved and available to the student by logging into the system.
6. RadGrad indicates current Level of the student, and advisor gives them the appropriate laptop sticker.

### Freshman student login, first time {#first-student-login}

*Context:* A student has met with an ICS advisor who has set up their RadGrad account. The student has received an email with login instructions. They now want to learn more about the ICS major.

*Goal:* RadGrad helps the student learn more about computer science in general and the ICS degree program in particular, in order to decide whether or not to pursue the degree program.

*Steps:* 

1. Student clicks on URL in email message from RadGrad to get to system.
2. Student logs in using their UH account and password.
3. Student goes to home page.  From the home page, the student can:
   * Browse Interests and learn more about them.
   * Browse Career Goals and learn more about them.
   * Browse Courses and learn more about them (review site, student reviews).
   * Watch short videos by ICS community members discussing the program and discipline.
   * Learn about alternatives to ICS degree programs (ITM, Computer Engineering, Communications, Graphic Arts, ACM). Also community college programs in security, networking, etc.?
4. RadGrad recommends that the student become engaged with the UH student community by attending the next meeting of ACM Manoa.

From this session, the student acquires a better understanding of the ICS degree program and the discipline and makes a decision as to whether or not to enroll in ICS 111 and ICS 141.  They might also decide to pursue a different discipline.

 
### Advisor meeting: during or after ICS 111. {#post111-radgrad}

*Context:* A student has made an initial commitment to an ICS degree by enrolling in ICS 111, and meets with an ICS Advisor to discuss next steps.

*Goal:* The student learns about how to use RadGrad to integrate extracurricular activities and measure progress through ICE Points and Levels.

*Steps:*

1. The advisor logs into RadGrad using their UH account and password and brings up the student's account.
2. If the student's STAR data is out of date, the advisor uploads current STAR data.
3. Advisor checks with student that RadGrad notifications are specified correctly.
2. The advisor introduces the student to RadGrad's recommendations, warnings, opportunities, ICE points, and Levels. 
3. The advisor gives the student a Level 1 laptop sticker because they enrolled in ICS 111.
4. The advisor and student discuss what the student needs to do to get to Level 2.
5. The advisor and student review and make adjustments to interests and career goals.

The student now has a better understanding of how to proceed through the ICS degree program, not only by taking courses, but also by taking on extracurricular activities (opportunities).

### RadGrad support for Juniors and Seniors {#advanced-radgrad}

*Context:* The student is well into their ICS Degree program. 

*Goal:* RadGrad provides useful, just-in-time guidance to the student.

*Steps:* 

1. RadGrad notices an "important" warning, recommendation, or opportunity.
2. RadGrad notifies the student (via text message or email) about the important warning, recommendation, or opportunity.
3. Student logs into RadGrad to follow up on the notification.
4. Student takes action based upon the notification.

### Opportunity verification, asynchronous {#opportunity-verification}

*Context:* A student has completed an opportunity (such as an internship or project) and wants to obtain ICE Points by having it verified.

*Goal:* The student gets verification with minimal overhead to student and faculty.

*Steps:*

1. The student logs in to RadGrad (on their mobile phone?) and browses to the opportunity instance.
2. The student clicks "Request verification" for that opportunity.
3. RadGrad generates a notification to the associated owner of that activity, as well as admins and advisors. 
4. The owner or admin or advisor logs on to RadGrad and navigates to the Process Verification Requests page.
5. The owner/admin/advisor brings up that request and presses a button to approve or decline it. An optional message can be included with the decision to provide additional information.
6. The student is notified that the opportunity instance verification request has been processed. 

### Opportunity verification, immediate {#opportunity-attendance}

*Context:* A student is attending an event and wants to obtain ICE Points by having it verified by a faculty member or admin who is physically in attendance. 

*Goal:*  The student gets verification with minimal overhead to student and faculty.

*Steps:* 

1. The student approaches the faculty member at the event to request verification.
2. The faculty member logs into RadGrad on their phone and brings up the "Verify Opportunity Attendance" page. 
3. The faculty member selects the opportunity they are currently attending, which brings up a page where the faculty member can enter UH account names of attendees.
4. The student gives the faculty member their UH account name and the faculty member types it in.
5. RadGrad records that the student has attended the event. 

### Student achieves next level {#leveling-up}

*Context:* A student obtains enough ICE points and/or other things to achieve the next Level.

*Goal:* The student is notified that they can get a new Level laptop sticker from an ICS advisor.

*Steps:*

1. The student performs an action that leads to a new level. For example, they have an opportunity approved which puts them over the top.
2. RadGrad notifies the student that they have achieved Level X and that they can receive a new laptop sticker from an ICS advisor.
3. The student goes to the ICS advisor. The ICS advisor gives them a sticker and indicates in RadGrad that they have received it. 

### New mentor enrollment {#new-mentor}

*Context:* An ICS alumni or community member wants to (or has agreed to) serve as a mentor. The mentor has obtained a UH account.

*Goal:* The mentor status can be established easily.

*Steps:*

1. An admin logs into RadGrad and defines the user with role mentor. RadGrad generates an email to the user to welcome them to the system and explain how things work.
2. The mentor logs in, fills out their profile information.
3. The mentor reviews the current set of questions, and answers any they find of interest.

### New mentorspace question {#new-mentorspace-question}

*Context:* A RadGrad user has an idea for a question for the mentor community.

*Goal:* New questions of an appropriate nature can be posted quickly.

*Steps:*

1. The RadGrad user posts their question to the "Submit new question" field on the MentorSpace page.
2. The admins and advisors are notified that there is a new mentor question request.
3. The admin/advisor logs into to RadGrad and goes to the "Process Mentor Questions" page.
4. They select the question to process.  They can edit it and post it or else decline it. They can provide a note back to the requesting user about what they decided to do.
5. If the question is accepted, then it appears on the MentorSpace page and all mentors are notified that there is a new question available for answering.

### MentorSpace notifications {#mentorspace-notifications}

*Context:* Students want to keep in touch with what Mentors are posting in MentorSpace.

*Goal:* Students are easily notified of changes to this page. 

*Steps:* 

1. Students can check a box to be notified of new questions or answers in the MentorSpace page.
2. When new postings occur, they are notified. 






