import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Users } from '../../../api/user/UserCollection';

Template.User_Career_Goals_Component.helpers({
  careerGoals() {
    const careerGoals = [];
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const user = Users.findDoc(userID);
      if (user) {
        _.map(user.careerGoalIDs, (id) => {
          careerGoals.push(CareerGoals.findDoc(id));
        });
      }
    }
    return careerGoals;
  },
  labelSize() {
    return Template.instance().labelSize;
  },
});

Template.User_Career_Goals_Component.events({
  // add your events here
});

Template.User_Career_Goals_Component.onCreated(function userCareerGoalsComponentOnCreated() {
  this.labelSize = this.data.labelSize;
  this.userID = this.data.userID;
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.User_Career_Goals_Component.onRendered(function userCareerGoalsComponentOnRendered() {
  // add your statement here
});

Template.User_Career_Goals_Component.onDestroyed(function userCareerGoalsComponentOnDestroyed() {
  // add your statement here
});

