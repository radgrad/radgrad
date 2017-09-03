import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../shared/route-user-name';

Template.User_Career_Goals_Component.helpers({
  careerGoals() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const profile = Users.getProfile(userID);
      if (profile) {
        return _.map(profile.careerGoalIDs, (id) => CareerGoals.findDoc(id));
      }
    }
    return [];
  },
  careerGoalURL(goal) {
    const slug = CareerGoals.getSlug(goal._id);
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return `/student/${getRouteUserName()}/explorer/career-goals/${slug}`;
    } else if (group === 'faculty') {
      return `/faculty/${getRouteUserName()}/explorer/career-goals/${slug}`;
    }
    return `/mentor/${getRouteUserName()}/explorer/career-goals/${slug}`;
  },
  count() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const profile = Users.getProfile(userID);
      return (profile.careerGoalIDs.length);
    }
    return 0;
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
});

Template.User_Career_Goals_Component.onRendered(function userCareerGoalsComponentOnRendered() {
  this.$('.ui.accordion').accordion();
});

Template.User_Career_Goals_Component.onDestroyed(function userCareerGoalsComponentOnDestroyed() {
  // add your statement here
});

