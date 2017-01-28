import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';

Template.User_Interests_Component.helpers({
  interests() {
    const interests = [];
    if (Template.instance().userID && Template.instance().userID.get()) {
      const userID = Template.instance().userID.get();
      const user = Users.findDoc(userID);
      console.log(user, Template.instance());
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
});

Template.User_Interests_Component.events({
  // add your events here
});

Template.User_Interests_Component.onCreated(function userInterestsComponentOnCreated() {
  this.labelSize = this.data.labelSize;
  this.userID = this.data.userID;
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.User_Interests_Component.onRendered(function userInterestsComponentOnRendered() {
  // add your statement here
});

Template.User_Interests_Component.onDestroyed(function userInterestsComponentOnDestroyed() {
  // add your statement here
});

