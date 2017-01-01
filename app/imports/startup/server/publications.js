import { AcademicYearInstances } from '../../api/year/AcademicYearInstanceCollection.js';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection.js';
import { Feed } from '../../api/feed/FeedCollection.js';
import { Feedbacks } from '../../api/feedback/FeedbackCollection.js';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { Interests } from '../../api/interest/InterestCollection.js';
import { InterestTypes } from '../../api/interest/InterestTypeCollection.js';
import { Opportunities } from '../../api/opportunity/OpportunityCollection.js';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection.js';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection.js';
import { Semesters } from '../../api/semester/SemesterCollection.js';
import { StarDataLogs } from '../../api/star/StarDataLogCollection';
import { Teasers } from '../../api/teaser/TeaserCollection.js';
import { Users } from '../../api/user/UserCollection.js';
import { ValidUserAccounts } from '../../api/user/ValidUserAccountCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection.js';

AcademicYearInstances.publish();
AdvisorLogs.publish();
CareerGoals.publish();
CourseInstances.publish();
Courses.publish();
FeedbackInstances.publish();
Feed.publish();
Feedbacks.publish();
HelpMessages.publish();
Interests.publish();
InterestTypes.publish();
Opportunities.publish();
OpportunityInstances.publish();
OpportunityTypes.publish();
Semesters.publish();
StarDataLogs.publish();
Teasers.publish();
Users.publish();
ValidUserAccounts.publish();
VerificationRequests.publish();
