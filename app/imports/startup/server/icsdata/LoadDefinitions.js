import { InterestTypes } from '/imports/api/interest/InterestTypeCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Users } from '/imports/api/user/UserCollection';
import { CareerGoals } from '/imports/api/career/CareerGoalCollection';
import { OpportunityTypes } from '/imports/api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Courses } from '/imports/api/course/CourseCollection';

import { careerGoalDefinitions } from '/imports/startup/server/icsdata/CareerGoalDefinitions';
import { courseDefinitions } from '/imports/startup/server/icsdata/CourseDefinitions';
import { interestTypeDefinitions, interestDefinitions } from '/imports/startup/server/icsdata/InterestDefinitions';
import { opportunityDefinitions, opportunityTypeDefinitions }
    from '/imports/startup/server/icsdata/OpportunityDefinitions';
import { userDefinitions } from '/imports/startup/server/icsdata/UserDefinitions';

/** @module LoadDefinitions */

/**
 * Loads all of the entity definitions in /imports/startup/server/icsdata.
 */
export function loadDefinitions() {
  interestTypeDefinitions.map((definition) => InterestTypes.define(definition));
  interestDefinitions.map((definition) => Interests.define(definition));
  userDefinitions.map((definition) => Users.define(definition));
  careerGoalDefinitions.map((definition) => CareerGoals.define(definition));
  opportunityTypeDefinitions.map((definition) => OpportunityTypes.define(definition));
  opportunityDefinitions.map((definition) => Opportunities.define(definition));
  courseDefinitions.map((definition) => Courses.define(definition));
}
