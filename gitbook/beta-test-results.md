# Spring 2017 Beta Test Results

## Subject A (March 13, 2017)

Subject A is a Senior in ICS who plans to graduate this year. Subject A had a significant amount of extra-curricular activities and coursework; A's initial ICE score was 80/132/115 (Level 4).
 
Here are some observations from review of the screencast:
 
1. On the ICE Points page, the "100" in the circles was confusing (since the subject's ICE score was over 100 in two categories). Recommend showing only the actual ICE value in the circle. The explanatory boxes provide enough breakdown. Addressed in Issue [100](https://github.com/radgrad/radgrad/issues/100).

2. Opportunities scroll off top of screen (already addressed by Aljon).

3. "Recommended opportunities is really useful. It's hard to know what's out there unless you watch the emails from Gerald."

4. Rating widget for reviews should display all five star options without scrolling.

5. In response to telling the subject that you're the kind of student who didn't need RadGrad, the subject responded, "Yes, but I had to put in a lot of extra work to get there. This makes it much simpler to see what you have to do."

6. What are three good things about RadGrad?  

    * Degree Planner: it makes it easier to see where you want to go.  

    * Recommended opportunities is really useful.  

    * I don't think it's expressed enough to students to do more than just take classes.  
    
    * I like the idea of gamifying the process. The stickers can be a signifier of who you might want to talk to.
     
7. What are three things that could be improved?

    * Figuring out where to find things seems difficult, but maybe after a training with Gerald it would be OK.
    
    * Performance is an issue.
    
## Subject B (March 13, 2017)

Subject B is a freshman in ICS who has completed only the first semester of courses.  Subject B's ICE score is 10/10/10 (we awarded Level 2).
  
Observations from review of the screencast:

1. Performance is a significant issue; it currently prevents us from being able to evaluate much of the UI. Loading times for the degree planner and home page are so slow that it inhibits users from retrieving them.  This beta test session needed to focus on the high level goals of the system as a result. 

2. Subject G was interested in how rankings and "relevant" opportunities were computed, because he was interested in the "less popular" interests and how to find them. For example, he was interested in "computer vision" and how to find opportunities specific for that interest. If there's no interest defined for a student's interest, then the system can't help find them.
 
3. What are three good things about RadGrad?

  * "There are so many students who just take classes and don't think beyond them. RadGrad is good at showing the importance of other activities.  Even though professors tell us, the message doesn't sink in.  In RadGrad, the ICE metric drives it home: if you don't do other things, you're just not prepared." 
  
4. What are things that could be improved?

  * "I'm not sure, I haven't had the opportunity to look at it in detail. But maybe the ability to customize opportunities or be notified when new opportunities come up?" Notifications are scheduled for implementation in Issue [111](https://github.com/radgrad/radgrad/issues/111). 
  
  * "Are there links to other resources, leads for us to follow? I guess I could just google..."  (The system does provide links for further reading.)

## Beta Test Interlude I

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

   * Subject C brought up the issue of stalking, and suggested it would be good to be able to opt-out of revealing your current/planned courses and opportunities in order to reduce the ability of stalkers to know your whereabouts.
     

## Beta Test Interlude II

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
  
  * It would be nice if the system could support the focus areas (i.e. Security focus degree requirements).



