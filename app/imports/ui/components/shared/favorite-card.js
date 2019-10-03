import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';

import { Slugs } from '../../../api/slug/SlugCollection.js';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { getRouteUserName } from '../shared/route-user-name';
import * as RouteNames from '../../../startup/client/router.js';
import { StudentParticipation } from '../../../api/public-stats/StudentParticipationCollection';
import { getGroupName } from './route-group-name';

Template.Favorite_Card.helpers({
  coursesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  itemName(item) {
    if (this.type === 'courses') {
      return `${item.name} (${item.number})`;
    }
    return item.name;
  },
  itemShortDescription(item) {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return `${description}...`;
  },
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  numberStudents(course) {
    const enrollment = StudentParticipation.findOne({ itemID: course._id });
    // console.log(course.name, enrollment.itemCount);
    return enrollment ? enrollment.itemCount : 0;
  },
  opportunitiesRouteName() {
    const group = getGroupName();
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else
    if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  typeCourse() {
    return (this.type === 'courses');
  },
  typeOpportunity() {
    return (this.type === 'opportunities');
  },
});

Template.Favorite_Card.events({
  'click .hide': function clickItemHide(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = this.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = {};
    updateData.id = profile._id;
    if (this.type === 'courses') {
      const studentItems = profile.hiddenCourseIDs;
      studentItems.push(id);
      updateData.hiddenCourses = studentItems;
    } else {
      const studentItems = profile.hiddenOpportunityIDs;
      studentItems.push(id);
      updateData.hiddenOpportunities = studentItems;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error hiding course/opportunity', error);
      }
    });
  },
  'click .unhide': function clickItemHide(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = this.item._id;
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = {};
    updateData.id = profile._id;
    if (this.type === 'courses') {
      let studentItems = profile.hiddenCourseIDs;
      studentItems = _.without(studentItems, id);
      updateData.hiddenCourses = studentItems;
    } else {
      let studentItems = profile.hiddenOpportunityIDs;
      studentItems = _.without(studentItems, id);
      updateData.hiddenOpportunities = studentItems;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error unhiding course/opportunity', error);
      }
    });
  },
});

Template.Favorite_Card.onRendered(function semesterCardOnRendered() {
  this.$('.ui .image').popup();
});
