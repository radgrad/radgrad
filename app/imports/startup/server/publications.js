import { Semesters } from '../../api/semester/SemesterCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Users } from '../../api/user/UserCollection.js';
import { AcademicYearInstances } from '../../api/year/AcademicYearInstanceCollection.js';


Semesters.publish();
Courses.publish();
CourseInstances.publish();
Feedbacks.publish();
FeedbackInstances.publish();
Interests.publish();
InterestTypes.publish();
Opportunities.publish();
OpportunityInstances.publish();
OpportunityTypes.publish();
CareerGoals.publish();
Users.publish();
AcademicYearInstances.publish();
