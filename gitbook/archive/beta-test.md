# Spring 2017 Beta Test

The goals of Spring 2017 RadGrad Beta Test are to: identify problems faced by students and advisors when using the system; collect data useful for improving the system; and determine overall satisfaction with the current design of RadGrad by these two user roles. 

This beta test will not assess users in the faculty or mentor roles.

### Test Plan: Students

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

# Results

### Subject A (March 13, 2017)

Subject A is a Senior in ICS who plans to graduate this year. Subject A had a significant amount of extra-curricular activities and coursework; A's initial ICE score was 80/132/115 (Level 4).
 
Here are some observations from review of the screencast:
 
1. On the ICE Points page, the "100" in the circles was confusing (since the subject's ICE score was over 100 in two categories). Recommend showing only the actual ICE value in the circle. The explanatory boxes provide enough breakdown. *(Addressed in Issue [100](https://github.com/radgrad/radgrad/issues/100).)*

2. Opportunities scroll off top of screen. *(Addressed by branch [design cleanup](https://github.com/radgrad/radgrad/tree/design-clean-up).)*

3. "Recommended opportunities is really useful. It's hard to know what's out there unless you watch the emails from Gerald."

4. Rating widget for reviews should display all five star options without scrolling. *(Addressed in [commit of April 3,2017](https://github.com/radgrad/radgrad/commit/c36b6a0eb7edc7dba937d0619a05fdf3809eaee5).)*

5. In response to telling the subject that you're the kind of student who didn't need RadGrad, the subject responded, "Yes, but I had to put in a lot of extra work to get there. This makes it much simpler to see what you have to do."

6. What are three good things about RadGrad?  

    * Degree Planner: it makes it easier to see where you want to go.  

    * Recommended opportunities is really useful.  

    * I don't think it's expressed enough to students to do more than just take classes.  
    
    * I like the idea of gamifying the process. The stickers can be a signifier of who you might want to talk to.
     
7. What are three things that could be improved?

    * Figuring out where to find things seems difficult, but maybe after a training with Gerald it would be OK.
    
    * Performance is an issue. (This is now fixed.)
    
### Subject B (March 13, 2017)

Subject B is a freshman in ICS who has completed only the first semester of courses.  Subject B's ICE score is 10/10/10 (we awarded Level 2).
  
Observations from review of the screencast:

1. Performance is a significant issue; it currently prevents us from being able to evaluate much of the UI. Loading times for the degree planner and home page are so slow that it inhibits users from retrieving them.  This beta test session needed to focus on the high level goals of the system as a result.  (This is now fixed.)

2. Subject G was interested in how rankings and "relevant" opportunities were computed, because he was interested in the "less popular" interests and how to find them. For example, he was interested in "computer vision" and how to find opportunities specific for that interest. If there's no interest defined for a student's interest, then the system can't help find them.
 
3. What are three good things about RadGrad?

  * "There are so many students who just take classes and don't think beyond them. RadGrad is good at showing the importance of other activities.  Even though professors tell us, the message doesn't sink in.  In RadGrad, the ICE metric drives it home: if you don't do other things, you're just not prepared." 
  
4. What are things that could be improved?

  * "I'm not sure, I haven't had the opportunity to look at it in detail. But maybe the ability to customize opportunities or be notified when new opportunities come up?" *(Notifications are scheduled for implementation in Issue [111](https://github.com/radgrad/radgrad/issues/111).)* 
  
  * "Are there links to other resources, leads for us to follow? I guess I could just google..."  *(Editor's note: The system does provide links for further reading, but this feature was not illustrated in this beta test. So not sure whether this is a usability issue or not.)*

### Beta Test Interlude I

Following the first day of beta testing, we realized that we needed to improve the performance of the system prior to doing any further beta testing.  This led to almost two weeks of work to determine the cause of the performance issues and how to address them.  We ultimately addressed the performance problems through two basic changes:

  * We implemented subscription caching to avoid subscribe/unsubscribe costs when traversing pages. 
  * In the degree planner, we removed the Add button from each semester, and the cumulative ICE icons, as these were found to be computationally expensive on each page render and were not necessary to the UI.

We made a number of other UI improvements during this time as well, which are summarized in Issues [96](https://github.com/radgrad/radgrad/issues/96), [97](https://github.com/radgrad/radgrad/issues/97), and [98](https://github.com/radgrad/radgrad/issues/98).


### Subject C (March 30, 2017)

Subject C recently graduated from the ICS program.  Subject C's ICE score was 10/134/10, which achieved Level 3. Because Subject C had already graduated, there were no planned courses or opportunities. Subject C did have a several year gap in their degree experience, which blew up the STAR data import mechanism. This was fixed manually for the beta test, and Issue [103](https://github.com/radgrad/radgrad/issues/103) specifies the work needed to fix it.

Unfortunately, no screencast was made of the session (on Philip's laptop, you must start screenflow prior to engaging Apple TV or else really, really, really bad things happen. And those bad things happened during this beta test.)

However, Amy and Philip took notes during the session and discussed the test afterwards. Here are our findings. 

1. Performance appears to have been eliminated as a usability issue. There was no discussion of loading time delays or any other performance issues during this beta test.

2. We discovered several opportunities for improvement to the usability of the system, summarized in [Issue 100](https://github.com/radgrad/radgrad/issues/100).

3. The Recommended Courses and Recommended Opportunities widgets on the home page have unintuitive scrolling behavior. First, it is not obvious that they scroll. Second, it is not obvious how to make them scroll. One idea: when you hover the mouse over the pane, right and left arrows appear to show you that you can scroll horizontally left and right. This work required to fix this is described in Issue [107](https://github.com/radgrad/radgrad/issues/107).

5. Good things:

  * RadGrad provides details about courses and opportunities not known to this student when they were in the department. Subject C learned about clubs and opportunities for the first time while perusing the interface. The subject was visibly excited to learn about opportunities and courses.
  
  * Subject C liked the recommendations and said that their own degree experience was almost like a "random walk" through the curriculum.
  
  * Subject C found out during interviews that having an internship would have been helpful.  Felt that RadGrad would be useful to students in helping them understand the benefits of extracurricular activities.
  
6. What could be improved?

   * Subject C brought up the issue of stalking, and suggested it would be good to be able to opt-out of revealing your current/planned courses and opportunities in order to reduce the ability of stalkers to know your whereabouts. This feature will be added as part of work for Issue [112](https://github.com/radgrad/radgrad/issues/112).
     

### Beta Test Interlude II

We made a number of UI improvements following Subject C, summarized in Issue [100](https://github.com/radgrad/radgrad/issues/100).

### Subject D (March 31, 2017)

Subject D is completing the core curriculum this semester. Subject D's ICE score is 5/16/5 (Level 2).  

While setting up Subject D's RadGrad account, Philip noticed that he had to almost completely remove the "generated" opportunities and add new ones from scratch in order to create a reasonable degree plan for review by the student.  Issue [101](https://github.com/radgrad/radgrad/issues/101) specifies the work required to address this problem.

Also as a result of the redesign, this student had extraneous academic years. Issue [109](https://github.com/radgrad/radgrad/issues/109) addresses that problem.

Review of the screencast revealed the following:

1. It turns out that this subject wants to do the security focus, and switched to the B.A. degree program this semester. This provided an opportunity to have the student use the UI to make changes to the courses and opportunities in their degree plan. This was the first subject who actively manipulated the interface themselves. We did a lot of coaching about what to click, but in general the student seemed to navigate the interface successfully.

2. The student was interested in seeing the impact of switching from the B.S. to the B.A. degree program. RadGrad didn't provide much insight. One could imagine some kind of recommendation or warning that says that the degree plan now specifies more ICS courses than are actually needed for the degree program. However, I worry that we won't encode (or keep up with) degree program requirements correctly, and thus end up giving out erroneous information. So I think this falls outside the scope of what RadGrad can accomplish, at least initially.
 
3. After the student had developed their degree plan, Philip asked him if he had one already. His response: "Yes, but I don't know where the paper went. I had this blank piece of paper where I had everything laid out." The student expressed interest in the ability to maintain their degree plan online through RadGrad.

4. Found a bug in the recommendation pane, addressed in Issue [110](https://github.com/radgrad/radgrad/issues/110).

5. We asked the subject about the UI, and the response was "I think if I were presented with this without anything being told to me, I could figure it out."

6. Regarding ICE points, the response was, "ICE is useful. People like games. It kinda makes it a game, in a way." 

8. "For me, STAR is broken. In my degree planner, it says everything is 'not in plan'. STAR doesn't seem like it's all there. "


Things that are useful about Rad Grad:

  * "I think it's pretty useful. With STAR, you have to know what you want before you login to specify your plan.  With this system, it's equally useful even if you have no idea what you want to do, because you can look into things."
  
  * "It's not just classes, it's you as a whole." 
  
  * "Mentor space."
  
  * "The fact that you can rate classes. Now you can not only try to figure out what you want to do, but you can also find out what other people thought of what you want to do. That helps if you're really not sure yet what you want to do. You can go here."
  
Things that could be improved:

  * If a course only appears once, it would be nice if clicking the remove button didn't pop up a menu with only one item.
  
  * It would be nice if the system could support the focus areas (i.e. Security focus degree requirements). *(This will be addressed in Issue [113](https://github.com/radgrad/radgrad/issues/113).)*
  
### Subject E (April 12, 2017)

Subject E is a freshman who is double majoring, with one major being in ICS, and is currently enrolled in ICS111/ICS141. Subject E's ICE score is 0/0/0 (Level 1).  

While setting up Subject E's RadGrad account, Philip manually edited the degree plan to correspond more to the student's specfied interests in security. 

Amy may have not stressed the importance of the over-arching philosophy behind RadGrad (importance of incorporating opportunities with courses to have a successful degree experience that will make a student competitive in the workforce) enough, so the student may not have fully understood the significance of incorporating features such as ICE.

Review of the screencast revealed the following:

1. The student was interested in the degree planner because it "Reminded me a lot of STAR. I like how it gives a thorough explanation of all the courses." When asked about experience using the degree planning on STAR, the response was that they do not use it because "it's very glitchy." Also added that "one factor that frustrates the most [about STAR] is that it doesn't let you consolidate the two majors. I have to switch back and forth between [the two degrees] and it feels really unnecessary."

2. The student was concerned about being able to know when certain courses are being offered, because it will "heavily affect" the student's degree planning.
 
3. Although the student's degree plan showed a four year plan, the student is currently planning for a five or six year plan and needed to manually reduce the amount of courses each semester.

4. On ICE points, the student wondered about "tangible benefits" for completing ICE.

5. Amy asked if the student liked how the recommended four year degree plan was generated rather than the student manually doing it themselves. Answer: yes.

6. The student instinctively dragged and dropped courses from one semester to another without being told how to do it.

7. Amy asked if they student would use it if it was released to the students to use. Answer: "I think yes. I think I will use it periodically. Especially during the registration period. I think the degree planner is the feature I will use the most often."


Things the student liked about Rad Grad:

  * "I liked how the department decided to create a individual space catered just towards the ICE students instead of just the STAR system."
  
  * "I like how you created a Mentorspace to connect to the graduates with actual experience in the field because when you are contained within the school, it is hard to get an idea of what you're actually going to do with the degree. Would be nice to reach out to even more graduates."
  
  * "Degree planner was nice."
  
  * "I like the layout."
  
Things that could be improved:

  * "I don't have any negative feelings about it at the moment."
    


### Subject Gerald Lau (April 13, 2017)
 
During this session we did a walkthrough of the system with Gerald Lau, the ICS academic advisor.  Our goal was to re-acquaint him with the basic capabilities of the system. We did not have him actively use the system, since we are in the process of implementing Academic Plans as first class entities in the system, and their implementation will substantially change the user interface with respect to a primary advisor function.  So, we walked him through the various pages available to both students and advisors and solicited his comments. Here are some of them:
 
  * About 300 students per year will use the system.
  
  * "It will be really helpful to have descriptions of faculty projects available to students.", "Right now, they'll say they are interested in Artificial Intelligence, and the only thing I can say is, 'Go see Professor Chin, or go see Professor Binsted.'"
  
  * "Need the versions of the Academic Plan in the planner. I know Cam is working on it."
  
  * "It's good to have a version of their ICS plan without the GenEd stuff."
  
  * "I'll need to have a mirror of the big screen monitor on my desktop since I wear bifocal glasses."
  
  * The research project opportunities are a good feature. "For the faculty, they can get an undergrad to help with research, and the undergrad gets 499 credit for it."
  
  * "It's important to allow students to opt-out of displaying future courses/opportunities, since some students have TROs out against others."
  

  







