import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ROLE } from '../../api/role/Role';
import { Users } from './UserCollection';
/**
 * Allows students to update their academic plans.
 */
export const updateAcademicPlanMethod = new ValidatedMethod({
  name: 'User.updateAcademicPlan',
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
      const user = Users.findDoc(this.userId);
      const docID = user._id;
      Users.update(docID, { academicPlan });
      return null;
    }
    return null;
  },
});
