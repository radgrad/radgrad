import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import * as FormUtils from '../form-fields/form-field-utilities.js';

function numReferences() {
  // currently nothing refers to a Teaser, but maybe in future something will.
  return 0;
}

/* eslint-disable max-len */

Template.List_Feeds_Widget.helpers({
  name(feed) {
    return `${feed.feedType} ${feed.description}`;
  },
  feeds() {
    const allFeeds = Feeds.find().fetch();
    const byTime = _.sortBy(allFeeds, function (feed) {
      return feed.timestamp;
    });
    return _.sortBy(byTime, function (feed) {
      return feed.feedType;
    });
  },
  count() {
    return Feeds.count();
  },
  deleteDisabled(feed) {
    return (numReferences(feed) > 0) ? 'disabled' : '';
  },
  descriptionPairs(feed) {
    const users = [];
    _.forEach(feed.userIDs, (id) => {
      users.push(Users.getFullName(id));
    });
    let opportunityName = '';
    if (feed.opportunityID) {
      opportunityName = Opportunities.findDoc(feed.opportunityID).name;
    }
    let courseName = '';
    if (feed.courseID) {
      const course = Courses.findDoc(feed.courseID);
      courseName = `${course.number}: ${course.shortName}`;
    }
    return [
      { label: 'Feed Type', value: feed.feedType },
      { label: 'Description', value: feed.description },
      { label: 'Timestamp', value: feed.timestamp.toString() },
      { label: 'Picture',
        value: `<div class="ui feed"><div class="event"><div class="label"><img src="${feed.picture}"/></div></div></div>` },
      { label: 'Users', value: users.toString() },
      { label: 'Opportunity', value: opportunityName },
      { label: 'Course', value: courseName },
      { label: 'Semester', value: Semesters.toString(feed.semesterID) },
    ];
  },
});

Template.List_Feeds_Widget.events({
  'click .jsUpdate': FormUtils.processUpdateButtonClick,
  'click .jsDelete': function (event, instance) {
    event.preventDefault();
    const id = event.target.value;
    removeItMethod.call({ collectionName: Feeds.getCollectionName(), instance: id }, (error) => {
      if (error) {
        FormUtils.indicateError(instance, error);
      }
    });
  },
});
