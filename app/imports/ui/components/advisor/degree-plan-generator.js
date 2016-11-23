import { Template } from 'meteor/templating';
import { lodash } from 'meteor/erasaur:meteor-lodash';

import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection.js';

Template.Degree_Plan_Generator.helpers({
  userFullName() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return Users.getFullName(user._id);
    }
    return 'Select a student';
  },
  desiredDegree() {
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      return user.desiredDegree;
    }
    return '';
  },
  interests() {
    const ret = [];
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      lodash.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  careerGoals() {
    const ret = [];
    const state = Template.instance().state;
    if (state && state.get('uhId')) {
      const uhID = state.get('uhId');
      const user = Users.getUserFromUhId(uhID);
      lodash.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
});

Template.Degree_Plan_Generator.events({
  // add your events here
});

Template.Degree_Plan_Generator.onCreated(function degreePlanGeneratorOnCreated() {
  this.state = this.data.dictionary;
});

Template.Degree_Plan_Generator.onRendered(function degreePlanGeneratorOnRendered() {
  // add your statement here
});

Template.Degree_Plan_Generator.onDestroyed(function degreePlanGeneratorOnDestroyed() {
  // add your statement here
});

