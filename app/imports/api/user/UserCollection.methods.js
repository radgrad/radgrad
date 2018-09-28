import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ROLE } from '../../api/role/Role';
import { Users } from './UserCollection';
import { StudentProfiles } from './StudentProfileCollection';

/**
 * Allows students to update their academic plans.
 * @memberOf api/user
 */
export const updateAcademicPlanMethod = new ValidatedMethod({
  name: 'User.updateAcademicPlan',
  mixins: [CallPromiseMixin],
  validate: null,
  run(academicPlan) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to dump the database..');
    } else
      if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT])) {
        // eslint-disable-next-line
        throw new Meteor.Error('unauthorized', 'You must be an admin, advisor, or student to update the academic plan.');
      }
    // Don't update except on server side (disable client-side simulation).
    if (Meteor.isServer) {
      const profile = Users.getProfile(this.userId);
      const docID = profile._id;
      StudentProfiles.update(docID, { academicPlan });
      return null;
    }
    return null;
  },
});

export const generateStudentEmailsMethod = new ValidatedMethod({
  name: 'User.studentEmails',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get student emails.');
    } else
    if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
      throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to get student emails.');
    }
    // Don't generate unless on Server side.
    if (Meteor.isServer) {
      const profiles = StudentProfiles.find({ isAlumni: false }).fetch();
      const students = _.map(profiles, (student) => student.username);
      return { students };
    }
    return null;
  },
});
