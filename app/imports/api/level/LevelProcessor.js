import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { getEarnedICE } from '../ice/IceProcessor';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { advisorLogsDefineMethod } from '../log/AdvisorLogCollection.methods';
import { defineMethod } from '../base/BaseCollection.methods';
import { RadGrad } from '../radgrad/RadGrad';

/**
 * Calculates the given student's Level.
 * @param studentID the studentID.
 * @returns {number}
 * @memberOf api/level
 */
export function defaultCalcLevel(studentID) {
  const instances = _.concat(CourseInstances.find({ studentID })
      .fetch(),
    OpportunityInstances.find({ studentID })
      .fetch());
  const verified = [];
  _.forEach(instances, (i) => {
    if (i.verified) { // May need to account for taking the class again.
      verified.push(i);
    }
  });
  const ice = getEarnedICE(verified);
  const numReviews = Reviews.find({ studentID, reviewType: 'course', moderated: true, visible: true })
    .count();
  const hasPicture = StudentProfiles.hasSetPicture(studentID);
  let level = 1;
  if (ice.i >= 100 &&
    ice.c >= 100 &&
    ice.e >= 100 &&
    numReviews >= 6 &&
    hasPicture) {
    level = 6;
  } else if (ice.i >= 80 &&
    ice.c >= 80 &&
    ice.e >= 80 &&
    numReviews >= 1 &&
    hasPicture) {
    level = 5;
  } else if (ice.i >= 30 &&
    ice.c >= 36 &&
    ice.e >= 30 &&
    numReviews >= 0 &&
    hasPicture) {
    level = 4;
  } else if ((ice.i >= 1 ||
      ice.e >= 1) &&
    ice.c >= 24 &&
    numReviews >= 0) {
    level = 3;
  } else if (ice.i >= 0 &&
    ice.c >= 12 &&
    ice.e >= 0 &&
    numReviews >= 0) {
    level = 2;
  }
  // console.log(studentID, ice, numReviews, level);
  return level;
}

/**
 * Updates the student's level.
 * @param advisor the advisors ID.
 * @param studentID the studentID.
 * @memberOf api/level
 */
export function updateStudentLevel(advisor, studentID) {
  let level;
  if (RadGrad.calcLevel) {
    level = RadGrad.calcLevel(studentID);
  } else {
    level = defaultCalcLevel(studentID);
  }
  const profile = StudentProfiles.getProfile(studentID);
  if (profile.level !== level) {
    const text = `Congratulations! ${profile.firstName} you're now Level ${level}.
         Come by to get your RadGrad sticker.`;
    const student = studentID;
    advisorLogsDefineMethod.call({ advisor, student, text }, (error) => {
      if (error) {
        console.log('Error creating AdvisorLog.', error);
      }
    });
    const feedData = {
      feedType: Feeds.NEW_LEVEL,
      user: profile.username,
      level,
    };
    defineMethod.call({ collectionName: 'FeedCollection', definitionData: feedData });
  }
  // console.log(`updateStudentLevel(${studentID}), ${level}`);
  StudentProfiles.setLevel(studentID, level);
}

/**
 * Updates all the students level.
 * @param advisor the advisors ID.
 * @memberOf api/level
 */
export function updateAllStudentLevels(advisor) {
  StudentProfiles.find()
    .forEach((student) => {
      updateStudentLevel(advisor, student.userID);
    });
  return StudentProfiles.find()
    .count();
}
