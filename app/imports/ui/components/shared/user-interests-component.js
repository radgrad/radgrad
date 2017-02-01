import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { getRouteUserName } from '../shared/route-user-name';

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
    const interests = [];
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const user = Users.findDoc(userID);
      if (user) {
        _.map(user.interestIDs, (id) => {
          interests.push(Interests.findDoc(id));
        });
      }
    }
    return interests;
  },
  labelSize() {
    return Template.instance().labelSize;
  },
  interestURL(i) {
    const slug = null;
    return `/student/${getRouteUserName()}/explorer/courses/${slug}`;
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

