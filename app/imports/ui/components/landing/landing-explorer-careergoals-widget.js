import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { isLabel } from '../../utilities/template-helpers';

Template.Landing_Explorer_CareerGoals_Widget.helpers({
  careerGoalName(careerGoalSlugName) {
    const slug = Slugs.find({ name: careerGoalSlugName }).fetch();
    const course = CareerGoals.find({ slugID: slug[0]._id }).fetch();
    return course[0].name;
  },
  interestsRouteName() {
    return RouteNames.studentExplorerInterestsPageRouteName;
  },
  interestSlugName(interestSlugName) {
    const slugID = Interests.findDoc(interestSlugName).slugID;
    return Slugs.getNameFromID(slugID);
  },
  isLabel,
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    const picture = Users.getProfile(user).picture;
    return picture || '/images/default-profile-picture.png';
  },
  userStatus(careerGoal) {  // eslint-disable-line
    return false;
  },
  userUsername(user) {
    return Users.getProfile(user).username;
  },
});

