import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { UserInteractions } from './UserInteractionCollection';

/**
 * The validated method for defining UserInteractions.
 * @memberOf api/analytic
 */
export const userInteractionDefineMethod = new ValidatedMethod({
  name: 'UserInteraction.define',
  validate: null,
  mixins: [CallPromiseMixin],
  run(interactionData) {
    UserInteractions.assertValidRoleForMethod(this.userId);
    return UserInteractions.define(interactionData);
  },
});

/**
 * The validated method for removing UserInteractions.
 * @memberOf api/analytic
 */
export const userInteractionRemoveUserMethod = new ValidatedMethod({
  name: 'UserInteraction.removeUser',
  validate: null,
  mixins: [CallPromiseMixin],
  run(instances) {
    UserInteractions.assertAdminRoleForMethod(this.userId);
    return UserInteractions.removeUser(instances);
  },
});

/**
 * The validated method for finding UserInteractions.
 * @memberOf api/analytic
 */
export const userInteractionFindMethod = new ValidatedMethod({
  name: 'UserInteraction.find',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ selector, options }) {
    UserInteractions.assertAdminRoleForMethod(this.userId);
    const results = UserInteractions.find(selector, options);
    return results.fetch();
  },
});
