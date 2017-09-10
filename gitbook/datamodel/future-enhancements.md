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

### The Raddie Awards

I think it would be fun to institute a tradition of announcing "Raddie Awards" at each graduation event, where we honor students who have performed well with respect to the rankings as well as other awards.

## Petitions {#petitions}

A goal of RadGrad is to empower students, because empowered students are more likely to be successful students. 

RadGrad includes a petition mechanism in order to provide students with a collective voice.  If students have an efficient and effective way to lobby for their interests within the department, they will be more likely to do so.  Active participation by students in the department will almost certainly lead to a better department.

Petitions provide department-level feedback. RadGrad also supports course-level feedback and degree-level feedback.

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










