import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as RouteNames from '../../../startup/client/router.js';
import { Users } from '../../../api/user/UserCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { getRouteUserName } from './route-user-name';
import { isInRole, isLabel } from '../../utilities/template-helpers';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';

Template.Explorer_Interests_Widget.helpers({
  courseNameFromSlug(courseSlugName) {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    return course[0].shortName;
  },
  coursesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerCoursesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerCoursesPageRouteName;
    }
    return RouteNames.mentorExplorerCoursesPageRouteName;
  },
  fullName(user) {
    return Users.getFullName(user);
  },
  getTableTitle(tableIndex) {
    switch (tableIndex) {
      case 0:
        return '<h4><i class="green checkmark icon"></i>Completed</h4>';
      case 1:
        return '<h4><i class="yellow warning sign icon"></i>In Plan (Not Yet Completed)</h4>';
      case 2:
        return '<h4><i class="red warning circle icon"></i>Not in Plan';
      default:
        return 'ERROR: More than one table.';
    }
  },
  isInRole,
  isLabel,
  opportunitiesRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentExplorerOpportunitiesPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyExplorerOpportunitiesPageRouteName;
    }
    return RouteNames.mentorExplorerOpportunitiesPageRouteName;
  },
  opportunityNameFromSlug(opportunitySlugName) {
    const slug = Slugs.find({ name: opportunitySlugName }).fetch();
    const opportunity = Opportunities.find({ slugID: slug[0]._id }).fetch();
    return opportunity[0].name;
  },
  toUpper(string) {
    return string.toUpperCase();
  },
  userPicture(user) {
    return Users.getProfile(user).picture || defaultProfilePicture;
  },
  usersRouteName() {
    const group = FlowRouter.current().route.group.name;
    if (group === 'student') {
      return RouteNames.studentCardExplorerUsersPageRouteName;
    } else if (group === 'faculty') {
      return RouteNames.facultyCardExplorerUsersPageRouteName;
    }
    return RouteNames.mentorCardExplorerUsersPageRouteName;
  },
  userStatus(interest) {
    let ret = false;
    const profile = Users.getProfile(getRouteUserName());
    if (_.includes(profile.interestIDs, interest._id)) {
      ret = true;
    }
    return ret;
  },
  userUsername(user) {
    return Users.getProfile(user).username;
  },
});

Template.Explorer_Interests_Widget.events({
  'click .addItem': function clickAddItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    const studentItems = profile.interestIDs;
    const group = FlowRouter.current().route.group.name;
    let collectionName = '';
    if (group === 'student') {
      collectionName = StudentProfiles.getCollectionName();
    } else if (group === 'faculty') {
      collectionName = FacultyProfiles.getCollectionName();
    } else {
      collectionName = MentorProfiles.getCollectionName();
    }
    const updateData = {};
    updateData.id = profile._id;
    studentItems.push(id);
    updateData.interests = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log(`Error updating ${profile.username}'s interests`, error);
      }
    });
  },
  'click .deleteItem': function clickRemoveItem(event) {
    event.preventDefault();
    const profile = Users.getProfile(getRouteUserName());
    const id = event.target.value;
    let studentItems = profile.interestIDs;
    const group = FlowRouter.current().route.group.name;
    let collectionName = '';
    if (group === 'student') {
      collectionName = StudentProfiles.getCollectionName();
    } else if (group === 'faculty') {
      collectionName = FacultyProfiles.getCollectionName();
    } else {
      collectionName = MentorProfiles.getCollectionName();
    }
    const updateData = {};
    updateData.id = profile._id;
    studentItems = _.without(studentItems, id);
    updateData.interests = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log(`Error updating ${profile.username}'s interests`, error);
      }
    });
  },
});
