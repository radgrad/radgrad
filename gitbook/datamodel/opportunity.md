# Opportunity

The Opportunity, OpportunityType, and OpportunityInstance entities enable RadGrad to represent extracurricular activities supporting professional development.  They contrast with curricular activities (i.e. coursework), as well as extracurricular activities not related to professional development (i.e. work).

<img src="images/Opportunity.png" width="600px">

Opportunities have the following structure:

* a name

* a slug.
 
* a textual description, possibly with links and images.

* a set of interests describing the opportunity.

* an image that can be displayed with this opportunity.
 
* An extensible classification system for opportunities. Some initial candidates include:

  * *Research:*  It is hoped that all faculty list at least one research project in which students can participate.
  * *Club:*  Active involvement in an organization such as ACM Manoa, GreyHats, Hawaii Student Entrepreneurs (hsentreprenuers.com), HICapacity, etc.
  * *Internship:* Working with a local high tech company as an intern.
  * *Event:*  A short-duration event, such as a Hackathon, Business Planning Competition, Security contest, [Google Summer of Code](https://developers.google.com/open-source/gsoc/), [CodeJam](https://code.google.com/codejam/), [Programming contest](https://icpc.baylor.edu/). 
etc. 
  * *Extramural Education:*  Coursera and Udacity are now offering "nano-degrees" and local organizations like DevLeague offer short-term, intensive educational opportunities. These activities have the potential to provide useful extracurricular education. 
  * *Publication:* For students who have been listed as an author on a refereed publication. 
  * *Inventor:* For students who have been listed on a patent application.
  * *Co-founder:* For students who co-found a company.
  
* *Faculty sponsor:*  The faculty member responsible for verifying student participation in the opportunity.

* *Hours per week:*  If an opportunity involves a substantial number of hours per week on a regular basis throughout the semester, then the student can indicate that so that the system can determine overcommitment. 

* *Semesters:* Opportunities are available to students during one or semesters. For example, a specific Hackathon might be available only during a single semester.  A research project might be available for many semesters. 

* *Notification interval:* To help the system appropriately notify students about this opportunity, each opportunity has a *startActive* date and *endActive* date associated with it.  The startActive date is the earliest date on which the system will inform students about this opportunity, and the endActive date is the latest date.  Some opportunities, like Hackathons, might have a notification interval of only a few weeks, while a research project might have a notification interval of years.  

Once an opportunity is defined, the system provides a (public?) URL that describes it. For example, if an opportunity called "ACM Manoa" is defined with slug "acm-manoa", then "http://radgrad.ics.hawaii.edu/opportunity/acm-manoa" will retrieve its description.

The opportunity workflow is as follows:

1. Opportunities are defined by faculty and admins.  For example, a faculty member can define a "research project"  and declare themselves to be the sponsor. If a student has authored or co-authored a published paper, then the faculty member can define the opportunity (for example, with the name "ICSE 2015: A new approach to mutatation testing") along with a brief description (which might be the abstract of the published paper), and the semester in which the paper appears. 
  
2. Students can "declare" their participation in one or more opportunities for one or more semesters in which it is available.

3. After a student declares their participation, the faculty sponsor is notified.  They then go to a "verification" page that lists all declared participation by students for which this faculty member is the sponsor. After doing whatever is needed to verify student participation for the indicated semester, the faculty member can click a verify button, at which point it will "count" for the student with respect to prediction and recommendation.

## Implementation

See [OpportunityCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-Opportunity-OpportunityCollection.html), [OpportunityTypeCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-OpportunityType-OpportunityTypeCollection.html), and [OpportunityInstanceCollection](https://philipmjohnson.gitbooks.io/radgrad-manual/content/api/jsdocs/module-OpportunityInstance-OpportunityInstanceCollection.html).