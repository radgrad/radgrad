import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

Template.Student_Profile_Card.onCreated(function studentProfileCardOnCreated() {
  this.hidden = new ReactiveVar(true);
});

function interestedStudentsHelper(item, type) {
  const interested = [];
  let instances;
  if (type === 'courses') {
    instances = CourseInstances.find({
      courseID: item._id,
    }).fetch();
  } else {
    instances = OpportunityInstances.find({
      opportunityID: item._id,
    }).fetch();
  }
  _.forEach(instances, (c) => {
    if (!_.includes(interested, c.studentID)) {
      interested.push(c.studentID);
    }
  });
  return interested;
}

Template.Student_Profile_Card.helpers({
  hidden() {
    return Template.instance().hidden.get();
  },
  itemName(item) {
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
    return description;
  },
  interestedStudents(course) {
    return interestedStudentsHelper(course, this.type);
  },
  itemSlug(item) {
    return Slugs.findDoc(item.slugID).name;
  },
  numberStudents(course) {
    return interestedStudentsHelper(course, this.type).length;
  },
});

Template.Student_Profile_Card.events({
  // add your events here
});

Template.Student_Profile_Card.onRendered(function studentProfileCardOnRendered() {
  // add your statement here
});

Template.Student_Profile_Card.onDestroyed(function studentProfileCardOnDestroyed() {
  // add your statement here
});

