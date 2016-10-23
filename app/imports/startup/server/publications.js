import { Semesters } from '../../api/semester/SemesterCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { CareerGoals } from '../../api/career/CareerGoalCollection';


Semesters.publish();
Courses.publish();
CourseInstances.publish();
Interests.publish();
InterestTypes.publish();
Opportunities.publish();
OpportunityInstances.publish();
OpportunityTypes.publish();
CareerGoals.publish();
