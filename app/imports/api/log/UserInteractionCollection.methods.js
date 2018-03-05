import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { UserInteractions } from './UserInteractionCollection';

/**
 * The validated method for defining UserInteractions.
 * @memberOf api/log
 */
export const userInteractionDefineMethod = new ValidatedMethod({
  name: 'UserInteraction.define',
  validate: null,
  run(defineData) {
    UserInteractions.assertValidRoleForMethod(this.userId);
    if (!this.userId) {
      console.log('unauthorized');
      throw new Meteor.Error('unauthorized', 'You must be logged in to define UserInteractions.');
    }
    return UserInteractions.define(defineData);
  },
});

/**
 * The validated method for removing UserInteractions.
 * @memberOf api/log
 */
export const userInteractionRemoveUserMethod = new ValidatedMethod({
  name: 'UserInteraction.removeUser',
  validate: null,
  run(removeArgs) {
    UserInteractions.assertValidRoleForMethod(this.userId);
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to remove from UserInteractions.');
    }
    return UserInteractions.removeUser(removeArgs);
  },
});
