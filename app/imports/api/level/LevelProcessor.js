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
  if (ice.i >= 100 && ice.c >= 100 && ice.e >= 100 && numReviews >= 6) {
    level = 6;
  } else
    if (ice.i >= 80 && ice.c >= 80 && ice.e >= 80 && numReviews >= 1) {
      level = 5;
    } else
      if (ice.i >= 30 && ice.c >= 36 && ice.e >= 30) {
        level = 4;
      } else
        if ((ice.i >= 1 || ice.e >= 1) && ice.c >= 24) {
          level = 3;
        } else
          if (ice.c >= 12) {
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
  console.log(`updateStudentLevel(${studentID}), ${level}`);
  StudentProfiles.setLevel(studentID, level);
}

/**
 * Updates all the students level.
 * @memberOf api/level
 */
export function updateAllStudentLevels() {
  StudentProfiles.find().forEach(student => updateStudentLevel(student._id));
}
