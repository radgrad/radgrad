import { Template } from 'meteor/templating';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role.js';

import { _ } from 'meteor/erasaur:meteor-lodash';
import { makeLink } from '../admin/datamodel-utilities';
import * as FormUtils from '../admin/form-fields/form-field-utilities.js';

Template.Student_Explorer_List_Career_Goals_Widget.onCreated(function onCreated() {
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
  this.subscribe(Slugs.getPublicationName());
});


function interestedUsers (careerGoal, role) {
  const interested = [];
  const users = Users.find({ roles: [role] }).fetch();
  _.map(users, (user) => {
    if (_.includes(user.careerGoalIDs, careerGoal._id)) {
      interested.push(user);
    }
  });
  return interested;
}

function numUsers(careerGoal, role) {
  return interestedUsers(careerGoal, role).length;
}

Template.Student_Explorer_List_Career_Goals_Widget.helpers({
  careerGoals() {
    return CareerGoals.find({}, { sort: { name: 1 } });
  },
  count() {
    return CareerGoals.count();
  },
  slugName(slugID) {
    return Slugs.findDoc(slugID).name;
  },
  descriptionPairs(careerGoal) {
    return [
      { label: 'Description', value: careerGoal.description },
      { label: 'More Information', value: makeLink(careerGoal.moreInformation) },
      { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
      { label: 'student(s)', value: numUsers(careerGoal, ROLE.STUDENT), type: 'amount'},
      { label: 'Students', value: interestedUsers(careerGoal, ROLE.STUDENT), type: 'list'},
      { label: 'faculty member(s)', value: numUsers(careerGoal, ROLE.FACULTY), type: 'amount'},
      { label: 'Faculty Members', value: interestedUsers(careerGoal, ROLE.FACULTY), type: 'list'},
      { label: 'alumni', value: numUsers(careerGoal, ROLE.ALUMNI), type: 'amount'},
      { label: 'Alumni', value: interestedUsers(careerGoal, ROLE.ALUMNI), type: 'list'},
    ];
  },
});

Template.Student_Explorer_List_Career_Goals_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event) {
    event.preventDefault();
    const id = event.target.value;
    CareerGoals.removeIt(id);
  },
});
