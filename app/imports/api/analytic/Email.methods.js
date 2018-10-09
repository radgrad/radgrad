import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { sendEmail } from './Email';
import { ROLE } from '../role/Role';

/**
 * The Email sendEmail ValidatedMethod.
 * @memberOf api/analytic
 */
export const sendEmailMethod = new ValidatedMethod({
  name: 'Email.sendEmail',
  validate: null,
  run(emailData) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to send emails.');
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an Admin to send emails.');
    }
    sendEmail(emailData);
  },
});
