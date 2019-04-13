import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences(careerGoal) {
  let references = 0;
  Users.findProfiles().forEach(function (profile) {
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      references += 1;
    }
  });
  return references;
}
Template.List_Career_Goals_Widget.onCreated(function listCareerGoalsOnCreated() {
  this.itemCount = new ReactiveVar(25);
  this.itemIndex = new ReactiveVar(0);
});

Template.List_Career_Goals_Widget.helpers({
  careerGoals() {
    const items = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
    const startIndex = Template.instance().itemIndex.get();
    const endIndex = startIndex + Template.instance().itemCount.get();
    const ret = _.slice(items, startIndex, endIndex);
    // console.log(startIndex, endIndex, ret);
    return ret;
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
      { label: 'References', value: `Users: ${numReferences(careerGoal)}` },
      { label: 'Retired', value: careerGoal.retired ? 'True' : 'False' },
    ];
  },
  getItemCount() {
    return Template.instance().itemCount;
  },
  getItemIndex() {
    return Template.instance().itemIndex;
  },
  getCollection() {
    return CareerGoals;
  },
  retired(item) {
    return item.retired;
  },
});

Template.List_Career_Goals_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: 'CareerGoalCollection', instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
