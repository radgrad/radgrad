/**
 * Created by Cam on 12/11/2016.
 */

import { AdminChoices } from '../../api/admin/AdminChoiceCollection';
import { AdvisorChoices } from '../../api/advisor/AdvisorChoiceCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Courses } from '../../api/course/CourseCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection';
import { DesiredDegrees } from '../../api/degree/DesiredDegreeCollection';
import { Feedbacks } from '../../api/feedback/FeedbackCollection';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { InterestTypes } from '../../api/interest/InterestTypeCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection';
import { Semesters } from '../../api/semester/SemesterCollection';
import { Slugs } from '../../api/slug/SlugCollection';  // do we want to fool with Slugs or are they already handled?
import { Users } from '../../api/user/UserCollection';  // same question as above.
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection';
import { WorkInstances } from '../../api/work/WorkInstanceCollection'; // why do we still have this?
import { AcademicYearInstances } from '../../api/year/AcademicYearInstanceCollection';

export const CollectionDictionary = {};
CollectionDictionary.AdminChoices = AdminChoices;
CollectionDictionary.AdvisorChoices = AdvisorChoices;
CollectionDictionary.CareerGoals = CareerGoals;
CollectionDictionary.Courses = Courses;
CollectionDictionary.CourseInstances = CourseInstances;
CollectionDictionary.DesiredDegrees = DesiredDegrees;
CollectionDictionary.Feedbacks = Feedbacks;
CollectionDictionary.FeedbackInstances = FeedbackInstances;
CollectionDictionary.HelpMessages = HelpMessages;
CollectionDictionary.Interests = Interests;
CollectionDictionary.InterestTypes = InterestTypes;
CollectionDictionary.AdvisorLogs = AdvisorLogs;
CollectionDictionary.Opportunities = Opportunities;
CollectionDictionary.OpportunityInstances = OpportunityInstances;
CollectionDictionary.OpportunityTypes = OpportunityTypes;
CollectionDictionary.Semesters = Semesters;
CollectionDictionary.Slugs = Slugs;
CollectionDictionary.Users = Users;
CollectionDictionary.VerificationRequests = VerificationRequests;
CollectionDictionary.WorkInstances = WorkInstances;
CollectionDictionary.AcademicYearInstances = AcademicYearInstances;
