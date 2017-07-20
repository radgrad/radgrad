import { Template } from 'meteor/templating';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { makeLink } from './datamodel-utilities';
import * as FormUtils from './form-fields/form-field-utilities.js';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

/** @module ui/components/admin/List_Users_Widget */

Template.List_Users_Widget.helpers({
  users() {
    return _.sortBy(Users.findProfiles({}, { sort: { lastName: 1 } }), function (u) {
      return u.lastName;
    });
  },
  count() {
    return Users.findProfiles().length;
  },
  deleteDisabled(user) {
    // TODO We have a race condition? the user profile is valid, but Users.getID fails.
    try {
      return user && (Users.isReferenced(user.username)) ? 'disabled' : '';
    } catch (e) {
      return '';
    }
  },
  slugName(slugID) {
    return slugID && Slugs.findDoc(slugID).name;
  },

  fullName(user) {
    const roles = Roles.getRolesForUser(user.userID);
    return user && `${user.lastName}, ${user.firstName} (${roles})`;
  },
  /**
   * Users are currently defined in two steps: an initial create with only a few fields, then a subsequent $set
   * to add the remaining fields. Because of this two-step process for creating users, the descriptionPairs method
   * will be called twice, once with a "partial" user document followed by a call with the complete user document.
   * To prevent descriptionPairs from calling methods like CareerGoals.findNames with the undefined value due to
   * the "partial" user document, the existence of a "complete" user document is checked before constructing the array.
   */
  descriptionPairs(user) {
    const pairs = [];
    pairs.push({ label: 'Username', value: user.username });
    pairs.push({ label: 'Name', value: `${user.firstName}  ${user.lastName}` });
    pairs.push({ label: 'Role', value: user.role });
    pairs.push({ label: 'Picture', value: makeLink(user.picture) });
    pairs.push({ label: 'Website', value: makeLink(user.website) });
    pairs.push({ label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(user.careerGoalIDs)) });
    pairs.push({ label: 'Interests', value: _.sortBy(Interests.findNames(user.interestIDs)) });
    if (user.role === ROLE.STUDENT) {
      pairs.push({ label: 'Level', value: user.level });
      // eslint-disable-next-line
      pairs.push({
        label: 'Degree',
        value: (user.academicPlanID) ? AcademicPlans.findDoc(user.academicPlanID).name : '',
      });
      // eslint-disable-next-line
      pairs.push({
        label: 'Declared Semester',
        value: (user.declaredSemesterID) ? Semesters.toString(user.declaredSemesterID) : '',
      });
    }
    if (user.role === ROLE.MENTOR) {
      pairs.push({ label: 'Company', value: user.company });
      pairs.push({ label: 'Title', value: user.career });
      pairs.push({ label: 'Location', value: user.location });
      pairs.push({ label: 'LinkedIn', value: user.linkedin });
      pairs.push({ label: 'Motivation', value: user.motivation });
    }
    return pairs;
  },
});

Template.List_Users_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    const profile = Users.getProfile(id);
    let collectionName;
    switch (profile.role) {
      case ROLE.ADVISOR:
        collectionName = AdvisorProfiles.getCollectionName();
        break;
      case ROLE.FACULTY:
        collectionName = FacultyProfiles.getCollectionName();
        break;
      case ROLE.MENTOR:
        collectionName = MentorProfiles.getCollectionName();
        break;
      default:
        collectionName = StudentProfiles.getCollectionName();
    }
    removeItMethod.call({ collectionName, instance: profile._id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
