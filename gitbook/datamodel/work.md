# Work

In RadGrad, "work" represents time-consuming extracurricular endeavors not related to professional development that the student pursues in order to make money. RadGrad provides an explicit representation for work because we have found that students sometimes overcommit themselves during a semester between "school" and "job". We hope that by enabling students to indicate for each semester how many hours, on average, they devote to "work", we can over time acquire data that helps them more successfully weigh the trade-offs and make good decisions about how many classes they can succeed in given their work obligations, and vice-versa. 

<img src="https://raw.githubusercontent.com/radgrad/datamodel/master/doc/images/Work.png" width="600px">

If a student is working at a job directly related to professional development, then it should be classified as an opportunity such as an internship, not as work.  Of course, appropriate trade-offs and time management still need to be applied.

If a student works at multiple jobs, then they should add up all of the hours and represent it as a single work instance. 
 
## Managing outside work commitments

A significant issue for ICS students is overcommitment to school and work.  There are several factors at play:

* The "15 to finish" program, which can be interpreted by students as encouragement to take a large number of ICS courses simultaneously.
* The greater-than-average number of hours required to succeed in (not merely pass) most of our ICS courses.
* The importance of success (as reflected by their ICS GPA) to finding job opportunities post-graduation.
* The need by many of our students to work a significant number of hours while attending school.

Gerald uses a simple "calculator" approach to help students estimate their workload. Here's my version:

```
Weekly workload in hours = (Num ICS courses X 9) + (Num non-ICS courses X 6) + (job hours)

Weekly workload should be less than 50 hours.
```

So, for example, if a student is taking 3 ICS courses (27 hours), and 2 non-ICS courses (12 hours), then according to this heuristic they should work no more than 10 hours a week to avoid endangering their ability to succeed in ICS courses.

While this calculator provides an indication of excessive workload, it does not provide the students with insight into the repercussions of exceeding the recommended workload, or even the accuracy of the calculator itself.

RadGrad's workload advisor will be integrated into degree planning. When a student indicates the ICS courses for a given semester, they can also provide an estimate of the number of hours they worked (or plan to work) during that semester.  As students complete semesters, RadGrad is updated with the grade data from STAR.  These two sources of data: student self-reported data on weekly hours spent at their job and STAR data, provides aggregate evidence for how ICS GPA varies with job workload. 
 
There is another important source of information: computer science GPA requirements from employers.  As part of RadGrad management, we will interview high tech employers to determine, among other things, their GPA expectations.
 
From the combination of ICS grade data, workload data, and employer expectations, we can provide students with a better understanding of the implications of their decisions. Ideally, we would like to be able to provide feedback similar to the following:
 
```
You are planning to take ICS 466, 469, 451, and 491 next semester, and work 20 hours a week.
 
According to our records, the average ICS GPA achieved by students taking a similar class and work load is 2.8.

Only 20% of employers surveyed for RadGrad would hire a student with a 2.8 ICS GPA. 
 
If you drop 1 ICS course and reduce your work hours to 10 per week, the average ICS GPA is 3.4.

Over 80% of employers surveyed for RadGrad would hire a student with a 3.4 ICS GPA.
```


  






