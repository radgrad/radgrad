import { Meteor } from 'meteor/meteor';
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
  const numCourseReviews = Reviews.find({ studentID, reviewType: 'course', moderated: true, visible: true })
    .count();
  const numOppReviews = Reviews.find({ studentID, reviewType: 'opportunity', moderated: true, visible: true })
    .count();
  const numReviews = numCourseReviews + numOppReviews;
  // console.log('defaultCalcLevel', earnedICE, plannedICE, numReviews);
  let level = 1;
  // console.log(Meteor.settings.public);
  if (earnedICE.i >= Meteor.settings.public.level.six.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.six.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.six.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.six.reviews &&
    plannedICE.i >= Meteor.settings.public.level.six.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.six.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.six.plannedICE.e) {
    level = 6;
  } else if (earnedICE.i >= Meteor.settings.public.level.five.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.five.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.five.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.five.reviews &&
    plannedICE.i >= Meteor.settings.public.level.five.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.five.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.five.plannedICE.e) {
    level = 5;
  } else if (earnedICE.i >= Meteor.settings.public.level.four.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.four.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.four.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.four.reviews &&
    plannedICE.i >= Meteor.settings.public.level.four.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.four.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.four.plannedICE.e) {
    level = 4;
  } else if (earnedICE.i >= Meteor.settings.public.level.three.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.three.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.three.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.three.reviews &&
    plannedICE.i >= Meteor.settings.public.level.three.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.three.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.three.plannedICE.e) {
    level = 3;
  } else if (earnedICE.i >= Meteor.settings.public.level.two.earnedICE.i &&
    earnedICE.c >= Meteor.settings.public.level.two.earnedICE.c &&
    earnedICE.e >= Meteor.settings.public.level.two.earnedICE.e &&
    numReviews >= Meteor.settings.public.level.two.reviews &&
    plannedICE.i >= Meteor.settings.public.level.two.plannedICE.i &&
    plannedICE.c >= Meteor.settings.public.level.two.plannedICE.c &&
    plannedICE.e >= Meteor.settings.public.level.two.plannedICE.e) {
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
