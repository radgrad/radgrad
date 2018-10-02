import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { getEarnedICE, getProjectedICE } from '../ice/IceProcessor';
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
  const earnedICE = getEarnedICE(instances);
  const plannedICE = getProjectedICE(instances);
  const numReviews = Reviews.find({ studentID, reviewType: 'course', moderated: true, visible: true })
    .count();
  const hasPicture = StudentProfiles.hasSetPicture(studentID);
  // console.log('defaultCalcLevel', earnedICE, plannedICE, numReviews, hasPicture);
  let level = 1;
  if (earnedICE.i >= 100 &&
    earnedICE.c >= 100 &&
    earnedICE.e >= 100 &&
    numReviews >= 6 &&
    plannedICE.i >= 100 &&
    plannedICE.c >= 100 &&
    plannedICE.e >= 100 &&
    hasPicture) {
    level = 6;
  } else if (earnedICE.i >= 80 &&
    earnedICE.c >= 80 &&
    earnedICE.e >= 80 &&
    numReviews >= 1 &&
    plannedICE.i >= 100 &&
    plannedICE.c >= 100 &&
    plannedICE.e >= 100 &&
    hasPicture) {
    level = 5;
  } else if (earnedICE.i >= 30 &&
    earnedICE.c >= 36 &&
    earnedICE.e >= 30 &&
    numReviews >= 0 &&
    plannedICE.i >= 100 &&
    plannedICE.c >= 100 &&
    plannedICE.e >= 100 &&
    hasPicture) {
    level = 4;
  } else if ((earnedICE.i >= 1 ||
      earnedICE.e >= 1) &&
    earnedICE.c >= 24 &&
    numReviews >= 0) {
    level = 3;
  } else if (earnedICE.i >= 0 &&
    earnedICE.c >= 12 &&
    earnedICE.e >= 0 &&
    numReviews >= 0) {
    level = 2;
  }
  // console.log('defaultCalcLevel', studentID, earnedICE, plannedICE, numReviews, hasPicture, level);
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
