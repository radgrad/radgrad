# Future enhancements

The design process for RadGrad has resulted in a variety of ideas for useful system capabilities that are beyond the scope for the initial release of the system.  The page provides documentation of these ideas.

## Vignettes {#vignettes}

Stories and experiences are vitally important to learning.  RadGrad vignettes are short postings provided by users regarding a professional experience.  

Vignettes have the following structure:

* *Name:*  The name of the vignette, for example, "My internship at Ikayzo".

* *Slug:*  A system-generated unique ID for the tag, suitable for a URL.  Created automatically from the name by lowercasing and substituting dashes for spaces.  If the name is "My internship at Ikayzo", the slug is "my-internship-at-ikayzo".  In the event of duplicates, a number is added to the end to enforce uniqueness.

* *Description:*  The multi-paragraph story, possibly augmented with images or links.  

* *Semester:* The semester in which this vignette occurred.

* *Author:* The user who wrote the vignette.

* *Interests:* The interests associated with this vignette.

Vignettes can discuss internship or conference experiences, mentorship experiences, and even particularly interesting debugging or other technical experiences.  The typically goal of a vignette is to provide some actionable information back to the community: you *should* do this, you should *avoid* that, etc.

While some vignettes will be posted by faculty, the goal is to have the majority of vignettes come from students, and for the vignettes to help new students become aware of the diversity of experiences and backgrounds of prior students who have succeeded in computer science.

The vignette workflow is as follows:

1. Vignettes can be written by any user.  Vignettes written by students must be "verified" by advisors. Vignettes written by faculty or advisors are automatically verified.
  
2. After a student writes a vignette, a notification is sent to the advisors, and it shows up on their verification page. The advisor can go to that page and click a button to verify the vignette after review and potentially editing the vignette.

3. Faculty and advisors can edit published vignettes at any time. 

## Stoplight  {#stoplight}

The stoplight is a UI widget embedded in the dashboard that is intended to provide a simple, intuitive, and effective answer to the question: how well is this student taking advantage of what the ICS department has to offer?

The widget takes the form of a stoplight that can indicate green, yellow, or red depending upon whether the student is taking excellent advantage, sufficient advantage, or not enough advantage of what the department has to offer. 

The stoplight takes into account:

* The student's specific professional interests and career goals.
* Their GPA
* The available opportunities associated with their interests and goals, and the ones with which they have taken advantage. 
* The courses in the department, and which ones the student has taken or is planning to take.

Recommendations provides actionable information for those student who wish to improve their use of opportunities provided by the ICS department.  

## Mentorship {#mentorship}

Mentorship in the form of one-to-one face-to-face interaction can be extremely important.  In the ideal case, each semester a student has both mentor(s) (i.e. more senior undergrads, or graduate students, or professors) as well as acting as a mentor (to less senior students, or potentially even high school students). 

Mentorship involves sustained engagement with another ICS community member in which useful guidance and/or technical skills are provided by the mentor to the mentored.  Mentorship is always associated with one or more interests. In general, mentorship should involve weekly interaction over the course of the semester.

Mentorship should be verified by faculty or advisors.  It generally occurs in the following ways:

* ICS 390.  Students in ICS 390 are also 101 TAs, and thus mentor beginning ICS students regarding technology. Any student taking ICS 390 is automatically accorded "mentor" status to underclassmen.

* TAs.  Students acting as undergraduate TAs for courses are also automatically accorded mentor status for that semester.
 
* Independent study (ICS 499).  Students taking an independent study course are automatically engaged in a mentorship relationship with that professor.

* Research group.  If a student actively participates in a research group [opportunity](opportunity.html), then the faculty sponsor can verify a mentorship relationship for each semester that the student is involved. 

Simply taking a class with a professor does not normally constitute a mentorship relationship (except for independent study).

There can be other forms of mentorship. For example, in ICS GreyHats, experienced members could mentor new members over the course of the semester to bring them up to speed on security-related techniques.  In this case, an advisor can accord the mentor and mentored relationships as appropriate.

Over time, the system will acquire a network structure that shows which users have engaged in mentorship with which other users, and what professional interests were the focus of the mentorship. This will enable the system to make suggestions to new users regarding mentorship opportunities.  

We also anticipate that students who form mentorship relationships early in their degree program, and maintain them, will have better post-graduation success.  As a simple example, they are likely to obtain more positive letters of recommendation.

## Leaderboard {#leaderboard}

Providing students with a way to compare their progress with others has the potential to provide benefits:

* It can provide actionable feedback on their performance relative to a peer group.
* It can incentivize better academic and professional behavior.

RadGrad will implement a  "leaderboard" to provide a means for students to compare their progress to others.  The leaderboard must be carefully designed to provide the above benefits while preserving  privacy and not incentivizing inappropriate behaviors. 

Most importantly, the RadGrad leaderboard does not reveal any identifying information about other students. So, for example, it might tell a student that they are ranked "#28" among their peer group, but does not tell the student anything about the 27 students who are ranked ahead of them.

Here are some potential metrics that could appear on a leaderboard:

* **ICS GPA rank.**  This metric indicates the student's ranking among all ICS students with respect to their ICS GPA.  To make the ranking more useful, students are separated into two groups: those within the core curriculum and those who have completed the core curriculum. This is because without two groups, a student who has taken only a single ICS course and received an A will rank higher than a student in their final semester who has received all As except for a single B. That just seems wrong.

* **Velocity.** This metric indicates the student's progress through the program.  It is calculated as the average number of ICS credits taken per semester since starting the degree program, multiplied by the ICS GPA (plus some weighting function for the GPA).  The metric rewards those who take a high number of ICS courses every semester and achieve a high GPA.
   
* **Professional preparation.** This metric (not yet defined) will rank students in a way that combines both their ICS coursework and their extracurricular activitities. 

### The Raddie Awards

I think it would be fun to institute a tradition of announcing "Raddie Awards" at each graduation event, where we honor students who have performed well with respect to the rankings as well as other awards.

## Petitions {#petitions}

A goal of RadGrad is to empower students, because empowered students are more likely to be successful students. 

RadGrad includes a petition mechanism in order to provide students with a collective voice.  If students have an efficient and effective way to lobby for their interests within the department, they will be more likely to do so.  Active participation by students in the department will almost certainly lead to a better department.

From the faculty perspective, it is often difficult to identify "widespread" student sentiment.  Petitions provide a means to prioritize student desires, and can also provide supporting evidence to argue to the administration for resources if they are needed to satisfy the petition. 

The petition mechanism works as follows:

  1. Any user can initiate a petition.  Initially, the petition is in draft mode, which means other users can comment on the wording or intent of the petition. The goal of draft mode is to improve the petition's wording and intent prior to requesting signatures. A petition must get 20 votes of confidence from other users to leave draft mode and enter signing mode. 

  2. Once in signing mode, the petition's wording is frozen, and users can sign it to indicate support.  Signing mode lasts exactly two weeks. Signing is a public act: everyone can see who signed the petition. The system shows the percentage of users who have signed the petition, which closely reflects the percentage of the department as a whole who support the petition.

  3. At the end of two weeks, the admins are notified by the system that the petition is closed and now ready for faculty action.  

  4. The faculty start to take action by adding an addendum to the petition indicating when it is scheduled for discussion at a faculty meeting. Students can send a representative to the meeting to answer questions.

  5. Once the petition is discussed and one or more actions are agreed upon by the faculty, another addendum is posted to the petition to indicate these results.

  6. Depending upon the nature of the petition, additional addendums might be added over time as actions are taken on the request.

  7. Eventually, the petition is closed and marked with one of the following states:
    * Implemented.
    * Not implemented.
    * Deferred.
  
## Course feedback {#course-feedback}

At UH, the combination of course evaluations occurring at the end of the semester and restrictive union laws means that:
 
  * Students typically provide feedback on courses after it is too late for their feedback to improve their own experience of the course,
   
  * Feedback is (by default) private to the instructor and anonymous from the students. This has the potential to decrease the impact and quality of the feedback.
 
RadGrad provides a mid-semester, public course evaluation system as a supplement to the current UH end-of-semester feedback approach. The goal of this system is to provide an efficient means to create useful course feedback at a point in time where course improvements can still be made.  
 
The feedback system works as follows:

1. For two weeks at the mid-point of the semester, each user is notified that the RadGrad Mid-Semester Course Feedback system is open.

2. Students can fill out a form for each course they are enrolled in that provides feedback about that course. During the two weeks, they can update their feedback.

3. At the end of the two weeks, the feedback system is closed.

4. Course feedback is published and made publicly available.  The users providing feedback for each course are shown, although they are not specifically associated with their authored comments.  This "semi-anonymous" approach is intended to encourage civility and productivity in the feedback.

5. Admins are able to edit or delete course feedback that appears uncivil or inappropriate.  

6. Faculty are able to provide a public response to the feedback.

Course feedback is archived and becomes a form of archival documentation about the course that future students can use to learn more about it and the professor's teaching style at that point in time.  

As with petitions and degree feedback, course feedback is based on the belief that an empowered student body whose voice is heard will lead to a better department and degree program experience. 

## Degree feedback {#degree-feedback}

Along with petitions and course feedback, students have the opportunity to provide feedback regarding the degree program as a whole. 

RadGrad solicits this feedback from students approximately six months after graduation.  At that time, the student is contacted via email and/or SMS and asked if they would follow a link to a page within RadGrad that gathers data about their current professional position and the impact of our degree program on their professional situation.  
 
We will request the following information from recent graduates:

* How many job (or graduate school) offers they received.

* Where are they working (or in what graduate school are they studying).

* What is their satisfaction with their current job (or graduate school) (1-5 scale)

* What is their current salary range (or stipend if in graduate school).

* What is their satisfaction with their current salary (or stipend) (1-5 scale)

* In what geographic location are they working (or in graduate school): Hawaii, mainland, california, etc.

* What is their job title (or graduate position)

* What are the three primary technologies they are working with (or if in graduate school, what are they studying).

* What aspects of the ICS degree program were most helpful to them in preparing for their current situation?

* What do they wish they would have learned during their ICS degree program?

* What set of three interests would they associate with their current position. 

Degree feedback is used in several ways:

  1. To assess our program and determine areas of improvement.
  
  2. To determine if our program is getting better or worse over time with respect to the readiness of our graduates to succeed.
  
  3. To provide data of use to current students in planning their own degree program.

## Predictions {#predictions}

A goal of RadGrad is to help students predict aspects of their post-graduation prospects based upon their current state and what they plan to accomplish during the remainder of their degree program. 

To do this, we will create a model based upon:

* Recent graduates, using their degree plan, career goals, and Degree Feedback data.

* Data from interviews with local high tech organizations, recruiters, headhunters, the [Occupational Outlook Handbook for Computer and Information Technology Occupations](http://www.bls.gov/ooh/computer-and-information-technology/home.htm), etc.

* Data from ICS faculty.  

The model will be revised every semester as new data from the sources becomes available.
 
The model, once implemented, takes as input a current student's degree plan and career goals and produces predictions (estimates?) of their post-graduate prospects.   

We can validate and improve this model over time as we gather data from graduates about their actual post-graduation experience and compare this to the predictions made by the model.










