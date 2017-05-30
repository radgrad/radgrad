import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { careerGoalsRemoveItMethod } from '../../../api/career/CareerGoalCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/List_Career_Goal_Widget */

function numReferences(careerGoal) {
  let references = 0;
  Users.find().forEach(function (userDoc) {
    if (_.includes(userDoc.careerGoalIDs, careerGoal._id)) {
      references += 1;
    }
  });
  return references;
}

Template.List_Career_Goals_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  count() {
    return CareerGoals.count();
  },
  deleteDisabled(careerGoal) {
    return (numReferences(careerGoal) > 0) ? 'disabled' : '';
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
      { label: 'References', value: `Users: ${numReferences(careerGoal)}` }];
  },
});

Template.List_Career_Goals_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    careerGoalsRemoveItMethod.call({ id }, (error, result) => {
      if (error) {
        console.log('Error deleting CareerGoal: ', error);
        FormUtils.indicateError(instance);
      }
      if (result) {
        FormUtils.indicateSuccess(instance, event);
      }
    });
  },
});
