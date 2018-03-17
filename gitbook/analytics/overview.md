# Overview

As noted in the [Introduction](../introduction/goals.md), the goals of RadGrad include improving degree planning, engagement, retention, research participation, diversity, and graduate success. This section describes the design of *onboard analytics* to support the gathering for evidence to understand whether or not we are achieving those goals. Onboard analytics refers to data that can be collected automatically through the operation of RadGrad and its use by users.

Note that onboard analytics can provide only part of the evidence necessary to understand our progress toward these goals.  Other forms of evidence, such as evidence gathered through interviews and focus groups, is also necessary.  This section does not cover those additional forms of evidence. 


### Design concepts

Our approach to onboard analytics involves the following design concepts:

*Subject Population*: Our subject population for each snapshot consists of all students enrolled in courses intended for majors during that semester. For example, this consists of 53 courses for the UH computer science department: two 100-level courses, six 200-level courses, eleven 300-level courses, and thirty four 400-level courses.  Currently, approximately 150 students are enrolled in 100-level courses each semester, dropping to approximately 75 per semester in 400-level courses.  The members of the subject population will change each semester as new students enter the program and old students either graduate or abandon the program. Note that every student in the subject population will be eligible for a RadGrad account.

*Student Profile*: In order to assess whether or not RadGrad improves retention and/or diversity among women and underrepresented minorities, we need to determine whether each student self-identifies as Female and/or Native Hawaiian. The Student Profile will provide this information. Our assumption is that profile data associated with a student does not change during their time in our program. (If it does, for example, if a student transitions from a male to a female during their time in our program, then that student will be excluded from our analytics because gender transition is a significant confounding variable.) We can access institutional records to determine this information, and/or allow students to specify this themselves. We will label female students as *F+*, and Native Hawaiian students as *NH+* in the following discussion.

*Semester Snapshot*: We will build a set of data structures called "Semester Snapshots", which provides information about the subject population during a given Fall or Spring semester.  

*Grade Level*: We will assign each student in a Semester Snapshot to one of the following Grade Levels based upon the number of semesters in which they have taken CS courses: *Year1* (one or two semesters); *Year2* (three or four semesters); *Year3* (five or six semesters); *Year4* (seven or eight semesters); or *Year5* (nine or more semesters).  For the UH computer science department, the number of students in each Grade Level generally parallel the course levels: approximately 150 *Year1*s, dropping to 75 *Year4*s and *Year5*s. Most students completing the degree program move through at least the first three Grade Levels.

*RadGrad active:* We will categorize each student in a semester snapshot as either an active user of RadGrad (*RadGrad+*) or not active (*RadGrad-*). To be classified as *RadGrad+* during a semester snapshot, the student must have: (a) logged into RadGrad at least once, and (b) changed their Degree Experience Plan (for example, by updating their set of Interests, Career Goals, or Opportunities). All other students will be classified as *RadGrad-*, indicating no modification of their DEP during that semester. While we intend for all students in a department to receive RadGrad training and develop an initial Degree Experience Plan, any further use of DEP/RadGrad is still voluntary and optional.
 
*CoP active:* Each Opportunity will be evaluated by RadGrad administrators to determine if it provides participants with the three characteristics of a Community of Practice. If so, the opportunity will be tagged as a CoP.    If a student participates in at least one Opportunity tagged as a CoP during a semester, then they are classified as *CoP+*, otherwise they are classified as *CoP-*. Preliminary analysis of the current RadGrad instance indicates that approximately half of the 70 Opportunities provide Communities of Practice.
 
*DEP Evolution:* RadGrad's instrumentation allows us to see how interests, career goals, planned activities, and ICE points all evolve over time.

### Assessments

#### Assessing adoption

The DEDM provides a straightforward way to measure RadGrad adoption: it is simply the percentage of * RadGrad+* students. Depending upon our analytic needs, we can compute adoption on a per semester basis over the entire subject population, by GradeLevel, aggregated over one or more semesters, or based on a slice the population that is *F+* and/or *NH+* students.

While we expect adoption to be high based upon our pilot studies, we do not expect universal adoption. If the overall adoption rate per semester is approximately 75%, and the overall subject population per semester is at least 400, then there will be at least 100 *RadGrad-* students per semester that we can use as a proxy for a "control" group to compare against the *RadGrad+* "treatment" group. (Section threats discusses limitations with this approach.)

#### Assessing engagement

According to McCormick, engagement measures the extent to which student are participating in educational practices that are strongly associated with high levels of learning and personal development. The North American National Survey of Student Engagement provides a generic instrument for assessing student engagement, though some researchers raise concerns with the application of these and other generic tools to computer science.

Based on the literature, we believe that ICE scores provide a valid, if not superior, alternative measure of engagement for undergraduates in computer science programs because they provide a fine-grained measure of verified student involvement with faculty-curated educational activities, both curricular and extracurricular. (See the Threats section for limitations with this approach.)

To measure the impact of DEP/RadGrad on engagement, we will compare the average number of ICE points per *RadGrad+* student in a given GradeLevel over the first two semesters of the project period to the subsequent four semesters of the project period. We interpret ICE points during the first semesters as a form of "pre-test" measure of engagement, i.e. these scores measure student engagement before RadGrad became a part of the subject population's undergraduate experience. In the final four semesters, we will be able to measure engagement over time for students for whom RadGrad has been a part of their degree experience since their second semester. We exclude *RadGrad-* students in order to increase the internal validity of ICE as a measure of engagement.  To compare student engagement before and after RadGrad, we can use a paired-samples t-test.

If DEP/RadGrad has a positive impact on engagement, then we predict that the average number of ICE points per *RadGrad+* student per GradeLevel will be significantly higher in the final four semesters compared to the first two semesters. For example, we predict that the average number of ICE points earned by *Year3 RadGrad+* students in Fall 2020 will be significantly more than the average number of ICE points earned by *Year3 RadGrad+* students in Fall 2018.  Note that impact will attenuate if more and more students achieve 100 points for each of the three categories, which DEP/RadGrad defines as the goal state for undergraduate preparation.

#### Assessing retention

The literature suggests that increased disciplinary engagement leads to increased retention. So, if DEP/\allowbreak RadGrad increases engagement (as assessed above), then we can predict that DEP/RadGrad will make a positive impact on retention.

In this study, we measure retention as follows: for any given semester, a student is considered "retained" if they increase at least one GradeLevel or graduate within two semesters. We can use this definition to calculate an overall "retention rate" for the entire population on a semester-by-semester basis, which is the percentage of retained students in the subject population for that semester.  We can also calculate retention rates for subpopulations, such as the retention rate for * FirstYear* students in Spr 18. Note that because we require data from the following two semesters to calculate retention for any given semester, we will only be able to calculate retention for the first four semesters of this six semester project.

Given our definition of retention rate, we predict that the retention rate for *RadGrad+* students will be higher than for *RadGrad-* students in any given semester, regardless of GradeLevel.  However, we also expect this difference to be greater at lower GradeLevels, since *Year4* and *Year5* students are close to graduation and highly motivated to finish, so there is less attrition at this level. To compare retention rates, we can employ an independent samples t-test.

It is possible that improved retention among *RadGrad+* students will have a ripple effect onto *RadGrad-* students (i.e. a rising tide lifts all boats). To see if that phenomena occurs, we will compare retention rates among *RadGrad-* students for a given GradeLevel over time. A ripple effect will manifest itself by an improving retention rate over time: for example, the retention rate for *Year1 RadGrad-* students in Spring 2020 will be higher than the rate for *Year1 RadGrad-* students in Spring 2018.

The literature also suggests that involvement with Communities of Practice should increase retention. To assess this, we can test to see if *CoP+* students exhibit higher retention rates than *CoP-* students.

#### Assessing diversity

If DEP/RadGrad has a positive impact on diversity, then if RadGrad is adopted by *F+* and *NH+*, then we predict that the percentage of *F+* and *NH+* students in a semester snapshot at the end of the project period will be significantly higher than the percentage of *F+* and *NH+* students in a semester snapshot at the beginning of the project period. To examine this hypothesis, we can compare the two samples using an independent samples t-test.

Because diversity is related to engagement and retention, we can assess these measures for *F+* and *NH+* students by doing the analyses as described above, but restricting ourselves to these subsets of our subject population.

Based upon the literature, we expect to observe high levels of adoption, plus positive changes in engagement and retention for females and Native Hawaiians over the course of the project period.

### Threats

One threat to this quasi-experimental design is extremely high or extremely low adoption.  If adoption is so high that there are almost no *RadGrad-* students, then there is no group to compare to *RadGrad+*. Conversely, if adoption is so low that there are no *RadGrad+* users, then the entire design falls apart. Based upon our pilot studies, in which students reacted quite positively to RadGrad, we are hopeful that adoption will be high but not total.

A second threat is the presence of a large number of engaged students who are *RadGrad-*. These are students who are academic high achievers and who participate in extracurricular disciplinary activities, but who do not want to represent their degree experience in RadGrad. Again, our pilot studies provide contrary evidence: the subset of students we approached who evidenced high engagement were among the most enthusiastic about using RadGrad.

A third and related threat is that our decision to use ICE scores to measure engagement means our engagement data cannot be compared to engagement data gathered using generic surveys such as NSSE.  A supplemental outcome of this project will be a study in which we administer the NSSE survey to a random selection of students, then compare this data to their ICE scores to see if a correlation exists.

A fourth threat is self-selection. Our design does not randomly assign students to the *RadGrad+* and *RadGrad-* or *CoP+* and *CoP-* groups, which weakens the interpretation of our statistical tests. However, we believe our current design is best suited to obtaining initial evidence regarding the strengths and weaknesses of DEP/RadGrad, and can lay the groundwork for future studies for which stronger experimental controls might be appropriate.

Finally, the computer science department associated with this study is not static. New initiatives, teaching approaches, and faculty are likely to be introduced over the course of the project. Any of these could also have a significant positive impact on engagement, retention, and diversity (and, to be honest, we hope that they will.) As such changes appear, we will use interview data to gather evidence as to their potential impact, and they will be incorporated into the interpretation of the results from this project.
