import { CourseInstances } from '../course/CourseInstanceCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Reviews } from '../review/ReviewCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import { getTotalICE } from '../ice/IceProcessor';
import { _ } from 'meteor/erasaur:meteor-lodash';

export function calcLevel(studentID) {
  const instances = _.concat(CourseInstances.find({ studentID }).fetch(),
      OpportunityInstances.find({ studentID }).fetch());
  const verified = [];
  _.map(instances, (i) => {
    if (i.verified) { // TODO need to not add taking the class again.
      verified.push(i);
    }
  });
  const ice = getTotalICE(verified);
  const numReviews = Reviews.find({ studentID, type: 'course', moderated: true, visible: true }).count();
  let level = 1;
  if (ice.i === 100 && ice.c === 100 && ice.e === 100 && numReviews >= 6) {
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
  // console.log(ice, numReviews, level);
  return level;
}

export function updateStudentLevel(studentID) {
  const level = calcLevel(studentID);
  // console.log(studentID, level);
  Users.setLevel(studentID, level);
}

export function updateAllStudentLevels() {
  const students = Users.find({ roles: [ROLE.STUDENT] }).fetch();
  _.map(students, (student) => {
    updateStudentLevel(student._id);
  });
}
