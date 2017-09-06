import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { FeedbackInstances } from './FeedbackInstanceCollection';

/**
 * Custom method for removing all the instances associated with a student and feedback function.
 * @memberOf api/feedback
 */
export const clearFeedbackInstancesMethod = new ValidatedMethod({
  name: 'FeedbackInstances.clear',
  validate: null,
  run({ user, functionName }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to clear FeedbackInstances.');
    }
    return FeedbackInstances.clear(user, functionName);
  },
});
