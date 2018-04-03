import { Template } from 'meteor/templating';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { isLabel } from '../../utilities/template-helpers';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

Template.Landing_Explorer_Interests_Widget.helpers({
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.findDoc({ name: courseSlugName });
    const course = Courses.findDoc({ slugID: slug._id });
    return course.shortName;
  },
  coursesRouteName() {
    return RouteNames.landingExplorerCoursesPageRouteName;
  },
  fullName(user) {
    return Users.getFullName(user);
  },
  getTableTitle(tableIndex) {
    switch (tableIndex) {
      case 0:
        return '<h4><i class="green checkmark icon"></i>Completed</h4>';
      case 1:
        return '<h4><i class="yellow warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
      case 2:
        return '<h4><i class="red warning circle icon"></i>Not in Plan';
      default:
        return 'ERROR: More than one table.';
    }
  },
  isLabel,
  opportunitiesRouteName() {
    return RouteNames.landingExplorerOpportunitiesPageRouteName;
  },
  opportunityNameFromSlug(opportunitySlugName) {
    const slug = Slugs.findDoc({ name: opportunitySlugName });
    const opportunity = Opportunities.findDoc({ slugID: slug._id });
    return opportunity.name;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    return Users.getProfile(user).picture || defaultProfilePicture;
  },
  usersRouteName() {
    return RouteNames.landingExplorerUsersPageRouteName;
  },
  userStatus(interest) { // eslint-disable-line
    return false;
  },
});
