import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Users } from '../../../api/user/UserCollection.js';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '../../../startup/client/router.js';

// /** @module ui/components/shared/Interest_List */

function matchingInterestsHelper(item) {
  const matchingInterests = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterestIDs = Users.getInterestIDs(user._id);
  const userInterests = _.map(userInterestIDs, (id) => Interests.findDoc(id));
  const itemInterests = _.map(item.interestIDs, (id) => Interests.findDoc(id));
  _.forEach(itemInterests, (itemInterest) => {
    _.forEach(userInterests, (userInterest) => {
      if (_.isEqual(itemInterest, userInterest)) {
        matchingInterests.push(userInterest);
      }
    });
  });
  return matchingInterests;
}

function matchingUserInterestsHelper(item) {
  const matchingInterests = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterestIDs = Users.getInterestIDsByType(user._id);
  const userInterests = _.map(userInterestIDs[0], (id) => Interests.findDoc(id));
  const itemInterests = _.map(item.interestIDs, (id) => Interests.findDoc(id));
  _.forEach(itemInterests, (itemInterest) => {
    _.forEach(userInterests, (userInterest) => {
      if (_.isEqual(itemInterest, userInterest)) {
        matchingInterests.push(userInterest);
      }
    });
  });
  return matchingInterests;
}

function matchingCareerInterestsHelper(item) {
  const matchingInterests = [];
  const user = Users.findDoc({ username: getRouteUserName() });
  const userInterestIDs = Users.getInterestIDsByType(user._id);
  const userInterests = _.map(userInterestIDs[1], (id) => Interests.findDoc(id));
  const itemInterests = _.map(item.interestIDs, (id) => Interests.findDoc(id));
  _.forEach(itemInterests, (itemInterest) => {
    _.forEach(userInterests, (userInterest) => {
      if (_.isEqual(itemInterest, userInterest)) {
        matchingInterests.push(userInterest);
      }
    });
  });
  return matchingInterests;
}

Template.Interest_List.helpers({
  item() {
    return Template.currentData().item;
  },
  size() {
    return Template.currentData().size;
  },
  interestName(interest) {
    return interest.name;
  },
  interestsRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerInterestsPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerInterestsPageRouteName;
    }
    return RouteNames.mentorExplorerInterestsPageRouteName;
  },
  interestSlug(interest) {
    return Slugs.findDoc(interest.slugID).name;
  },
  matchingInterests(course) {
    try {
      return matchingInterestsHelper(course);
    } catch (err) {
      return null;
    }
  },
  matchingUserInterests(course) {
    try {
      return matchingUserInterestsHelper(course);
    } catch (err) {
      return null;
    }
  },
  matchingCareerInterests(course) {
    try {
      return matchingCareerInterestsHelper(course);
    } catch (err) {
      return null;
    }
  },
  otherInterests(course) {
    try {
      const matchingInterests = matchingInterestsHelper(course);
      const courseInterests = _.map(course.interestIDs, (id) => Interests.findDoc(id));
      return _.filter(courseInterests, function filter(courseInterest) {
        let ret = true;
        _.forEach(matchingInterests, (matchingInterest) => {
          if (_.isEqual(courseInterest, matchingInterest)) {
            ret = false;
          }
        });
        return ret;
      });
    } catch (err) {
      return null;
    }
  },
});
