import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { getEarnedICE } from '../ice/IceProcessor';

/**
 * Calculates the given student's Level.
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/level
 */
export function calcLevel(studentID) {
  const instances = _.concat(CourseInstances.find({ studentID }).fetch(),
      OpportunityInstances.find({ studentID }).fetch());
  const verified = [];
  _.forEach(instances, (i) => {
    if (i.verified) { // May need to account for taking the class again.
      verified.push(i);
    }
  });
  const ice = getEarnedICE(verified);
  const numReviews = Reviews.find({ studentID, reviewType: 'course', moderated: true, visible: true }).count();
  let level = 1;
  if (ice.i >= Meteor.settings.public.level.six.i &&
      ice.c >= Meteor.settings.public.level.six.c &&
      ice.e >= Meteor.settings.public.level.six.e &&
      numReviews >= Meteor.settings.public.level.six.reviews) {
    level = 6;
  } else
    if (ice.i >= Meteor.settings.public.level.five.i &&
        ice.c >= Meteor.settings.public.level.five.c &&
        ice.e >= Meteor.settings.public.level.five.e &&
        numReviews >= Meteor.settings.public.level.five.reviews) {
      level = 5;
    } else
      if (ice.i >= Meteor.settings.public.level.four.i &&
          ice.c >= Meteor.settings.public.level.four.c &&
          ice.e >= Meteor.settings.public.level.four.e) {
        level = 4;
      } else
        if ((ice.i >= Meteor.settings.public.level.three.i ||
                ice.e >= Meteor.settings.public.level.three.e) &&
            ice.c >= Meteor.settings.public.level.three.c) {
          level = 3;
        } else
          if (ice.c >= Meteor.settings.public.level.two.c) {
            level = 2;
          }
  // console.log(studentID, ice, numReviews, level);
  return level;
}

/**
 * Updates the student's level.
 * @param studentID the studentID.
 * @memberOf api/level
 */
export function updateStudentLevel(studentID) {
  const level = calcLevel(studentID);
  // console.log(`updateStudentLevel(${studentID}), ${level}`);
  StudentProfiles.setLevel(studentID, level);
}

/**
 * Updates all the students level.
 * @memberOf api/level
 */
export function updateAllStudentLevels() {
  StudentProfiles.find().forEach(student => updateStudentLevel(student.userID));
}
