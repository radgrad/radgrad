import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../shared/route-user-name';

// /** @module ui/components/shared/User_Interests_Component */

Template.User_Interests_Component.helpers({
  count() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const user = Users.findDoc(userID);
      return (user.interestIDs.length);
    }
    return 0;
  },
  interests() {
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const user = Users.findDoc(userID);
      if (user) {
        return _.map(user.interestIDs, (id) => Interests.findDoc(id));
      }
    }
    return [];
  },
  labelSize() {
    return Template.instance().labelSize;
  },
  interestURL(i) {
    const group = FlowRouter.current().route.group.name;
    const slug = Interests.getSlug(i._id);

    if (group === 'student') {
      return `/student/${getRouteUserName()}/explorer/interests/${slug}`;
    } else if (group === 'faculty') {
      return `/faculty/${getRouteUserName()}/explorer/interests/${slug}`;
    }
    return `/mentor/${getRouteUserName()}/explorer/interests/${slug}`;
  },
});

Template.User_Interests_Component.events({
  // add your events here
});

Template.User_Interests_Component.onCreated(function userInterestsComponentOnCreated() {
  this.labelSize = this.data.labelSize;
  this.userID = this.data.userID;
});

Template.User_Interests_Component.onRendered(function userInterestsComponentOnRendered() {
  this.$('.ui.accordion').accordion();
});

Template.User_Interests_Component.onDestroyed(function userInterestsComponentOnDestroyed() {
  // add your statement here
});

