# ICE (Innovation, Competency, Experience)

A high quality undergraduate computer science experience should give students three capabilities to help them succeed in their next stage of professional development: 
 
1. Direct involvement in **Innovation** (through research or other innovation-related activities).
2. Development of **Competency** (through computer science classes).
3. **Experience** with professional high tech environments (through internships or other profession-related activities)

As a recruiter recently told me, "We no longer consider a student whose background doesn't include one or more internships, 
startup weekends, hackathons, open source projects, and so forth."

RadGrad provides "ICE", which provides a simple measure of a student's participation in activities related to innovation, competency, and experience. The ICE user interface also provides a means for students to assess the adequacy of their participation in these three kinds of activities. 

The goal of ICE is to make students aware that innovation and experience are as important as competency to a high quality undergraduate CS education, to provide students and advisors with a new means to  assess gaps in a student's preparation, and to provide students with a sense for a "good" ICE value through the ranking system.

### Computing ICE

An integer value is computed separately for each of the three components.  The goal of the measure is to be simple to understand, simple to compute, aggressive but achievable for motivated students.

#### 100 points equals 100%
  
The current approach to measurement is termed "100 points equals 100%". The idea is that each of three components of ICE is measured in such a way that if a student accumulates 100 points, they have "crossed the finish line" for that aspect of ICE.  The point system is designed to so that a well-motivated student can achieve 100 points for each of the three components by the time they graduate, and that this accomplishment demonstrates significant capability with respect to each of the three components.  

Here is how each of the three measures is computed.

#### Measuring Competency

The Competency metric is measured by awarding the student 9 points for each A (or A+ or A-) received in a CS course and 5 points for each B (or B+ or B-). No points are awarded for grades below B-.

The B.S. in CS requires 16 computer science courses.  If a student gets all A's and B's in their ICS courses, then they can cross the 100 point threshold by getting 5 A's and 11 B's (corresponding to a 3.3 GPA in ICS courses). 

Students should normally take 3 ICS courses per semester when enrolled full-time.  If they get all A's, they earn 27 competency points. If they get all B's, they earn 15 competency points. 

#### Measuring Innovation

The Innovation metric is based upon Opportunities that have a research (or some other innovative) component.  Opportunities lasting only a single day or weekend (such as a Hackathon or Programming Contest) are worth 10 points.  Opportunities lasting a semester (such as participation in a research project) can be worth up to 25 points. Full time summer research positions can be worth up to 50 points. 

To obtain 100 Innovation points, the student must average 25 innovation points over four semesters. 

#### Measuring Experience 

The Experience metric is based upon Opportunities that have a professional development component.  Like Innovation, single day or weekend opportunities are worth 10 points, and part-time semester opportunities are worth 25 points. Full-time summer opportunities such as internships can be worth up to 50 points. 

Similar to Innovation, one can accumulate 100 points over four semesters by obtaining at least 25 points in each semester.

#### About Double dipping

The ICE metric is explicitly designed to support double dipping by combining an ICS 499 (independent study) with an Opportunity. For example, it is possible for a student to enroll in an ICS 499 for a semester in which they work with Lipyeow Lim on a Database Research opportunity.  In this case, if the student received an A, they could receive 9 Competency points as well as 20 Innovation points.

Similarly, one could combine an ICS 499 with an internship to obtain both Competency and Experience points in a single semester. 

### Percentile Ranking in ICE

The "100 points equals 100%" measure is designed to provide a non-competitive approach to understanding ICE; in other words, it is possible for 100% of the ICS students to obtain 100% for each of the three ICE components.
 
That said, it is often illuminating to see where you stand against other students, and so it is possible to compute your percentile standing.  To do this, one must first determine a "peer group", because it would be unfair to compare the ICE values for a student just starting the program to a student who is about to graduate. 

In ICE, the peer group is determined by the number of semesters since your first computer science course (including summer semesters). 

### ICE stops at 100

Although it is possible for students to accumulate more than 100 points in a category, the maximum displayed value of ICE is 100.  This is because the goal of the measure is to help as many students as possible cross the "finish line" of 100 points for each category.  It is not clear that striving for, say, 200 Experience points is really a good goal.

## Implementation

See [IceProcessor](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-IceProcessor.html).
 
