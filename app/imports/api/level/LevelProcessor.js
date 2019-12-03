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
  const instances = _.concat(CourseInstances.find({ studentID }).fetch(),
    OpportunityInstances.find({ studentID }).fetch());
  const earnedICE = getEarnedICE(instances);
  const plannedICE = getProjectedICE(instances);
  const numCourseReviews = Reviews.find({
    studentID, reviewType: 'course', moderated: true, visible: true,
  })
    .count();
  const numOppReviews = Reviews.find({
    studentID, reviewType: 'opportunity', moderated: true, visible: true,
  })
    .count();
  const numReviews = numCourseReviews + numOppReviews;
  // console.log('defaultCalcLevel', earnedICE, plannedICE, numReviews);
  let level = 1;
  // console.log(Meteor.settings.public);
  if (earnedICE.i >= Meteor.settings.public.level.six.earnedICE.i
    && earnedICE.c >= Meteor.settings.public.level.six.earnedICE.c
    && earnedICE.e >= Meteor.settings.public.level.six.earnedICE.e
    && numReviews >= Meteor.settings.public.level.six.reviews
    && plannedICE.i >= Meteor.settings.public.level.six.plannedICE.i
    && plannedICE.c >= Meteor.settings.public.level.six.plannedICE.c
    && plannedICE.e >= Meteor.settings.public.level.six.plannedICE.e) {
    level = 6;
  } else if (earnedICE.i >= Meteor.settings.public.level.five.earnedICE.i
    && earnedICE.c >= Meteor.settings.public.level.five.earnedICE.c
    && earnedICE.e >= Meteor.settings.public.level.five.earnedICE.e
    && numReviews >= Meteor.settings.public.level.five.reviews
    && plannedICE.i >= Meteor.settings.public.level.five.plannedICE.i
    && plannedICE.c >= Meteor.settings.public.level.five.plannedICE.c
    && plannedICE.e >= Meteor.settings.public.level.five.plannedICE.e) {
    level = 5;
  } else if (earnedICE.i >= Meteor.settings.public.level.four.earnedICE.i
    && earnedICE.c >= Meteor.settings.public.level.four.earnedICE.c
    && earnedICE.e >= Meteor.settings.public.level.four.earnedICE.e
    && numReviews >= Meteor.settings.public.level.four.reviews
    && plannedICE.i >= Meteor.settings.public.level.four.plannedICE.i
    && plannedICE.c >= Meteor.settings.public.level.four.plannedICE.c
    && plannedICE.e >= Meteor.settings.public.level.four.plannedICE.e) {
    level = 4;
  } else if (earnedICE.i >= Meteor.settings.public.level.three.earnedICE.i
    && earnedICE.c >= Meteor.settings.public.level.three.earnedICE.c
    && earnedICE.e >= Meteor.settings.public.level.three.earnedICE.e
    && numReviews >= Meteor.settings.public.level.three.reviews
    && plannedICE.i >= Meteor.settings.public.level.three.plannedICE.i
    && plannedICE.c >= Meteor.settings.public.level.three.plannedICE.c
    && plannedICE.e >= Meteor.settings.public.level.three.plannedICE.e) {
    level = 3;
  } else if (earnedICE.i >= Meteor.settings.public.level.two.earnedICE.i
    && earnedICE.c >= Meteor.settings.public.level.two.earnedICE.c
    && earnedICE.e >= Meteor.settings.public.level.two.earnedICE.e
    && numReviews >= Meteor.settings.public.level.two.reviews
    && plannedICE.i >= Meteor.settings.public.level.two.plannedICE.i
    && plannedICE.c >= Meteor.settings.public.level.two.plannedICE.c
    && plannedICE.e >= Meteor.settings.public.level.two.plannedICE.e) {
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

export function getLevelCriteriaStringMarkdown(level) {
  if (!_.includes(['six', 'five', 'four', 'three', 'two'], level)) {
    throw new Meteor.Error(`${level} is not a valid level`);
  }
  const criteria = Meteor.settings.public.level[level];
  let plannedICEStr = '';
  if (criteria.plannedICE.i !== 0 || criteria.plannedICE.c !== 0 || criteria.plannedICE.e !== 0) {
    plannedICEStr = '+ Planned ICE of';
    if (criteria.plannedICE.i !== 0) {
      plannedICEStr = `${plannedICEStr} **I >= ${criteria.plannedICE.i},`;
    }
    if (criteria.plannedICE.c !== 0) {
      plannedICEStr = `${plannedICEStr} C >= ${criteria.plannedICE.c},`;
    }
    if (criteria.plannedICE.e !== 0) {
      plannedICEStr = `${plannedICEStr} E >= ${criteria.plannedICE.e}**`;
    }
  }
  let earnedICEStr = '';
  if (criteria.earnedICE.i !== 0 || criteria.earnedICE.c !== 0 || criteria.earnedICE.e !== 0) {
    earnedICEStr = '+ Earned ICE of';
    if (criteria.earnedICE.i !== 0) {
      earnedICEStr = `${earnedICEStr} **I >= ${criteria.earnedICE.i},`;
    }
    if (criteria.earnedICE.c !== 0 && criteria.earnedICE.e !== 0) {
      earnedICEStr = `${earnedICEStr} C >= ${criteria.earnedICE.c},`;
    }
    if (criteria.earnedICE.c !== 0 && criteria.earnedICE.e === 0) {
      earnedICEStr = `${earnedICEStr} **C >= ${criteria.earnedICE.c}**`;
    }
    if (criteria.earnedICE.e !== 0) {
      earnedICEStr = `${earnedICEStr} E >= ${criteria.earnedICE.e}**`;
    }
  }
  let reviewsStr = '';
  if (criteria.reviews > 1) {
    reviewsStr = `+ **${criteria.reviews}** reviews of courses or opportunities`;
  } else if (criteria.reviews === 1) {
    reviewsStr = `+ **${criteria.reviews}** review of a course or opportunity`;
  }
  let criteriaString = '';
  if (plannedICEStr !== '' && earnedICEStr !== '' && reviewsStr !== '') {
    criteriaString = `

${plannedICEStr}
    
${earnedICEStr}

${reviewsStr}`;
  } else if (plannedICEStr !== '' && earnedICEStr !== '' && reviewsStr === '') {
    criteriaString = `

${plannedICEStr}

${earnedICEStr}`;
  } else if (plannedICEStr === '' && earnedICEStr !== '' && reviewsStr === '') {
    criteriaString = `
    
${earnedICEStr}`;
  }
  return criteriaString;
}

export function getLevelHintStringMarkdown(level) {
  let result = '';
  switch (level) {
    case 'six':
      // eslint-disable-next-line max-len
      result = `If you achieve Level 6, you are truly one of the elite ICS students, and you will have demonstrated excellent preparation for entering the workforce, or going on to Graduate School, whichever you prefer. Congratulations! 
      
The criteria for **Level 6** is ${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'five':
      // eslint-disable-next-line max-len
      result = `Level 5 students are far along in their degree program, and they've made significant progress toward 100 verified points in each of the three ICE categories. You will probably be at least a Junior before Level 5 becomes a realistic option for you. 
      
The criteria for **Level 5** is ${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'four':
      // eslint-disable-next-line max-len
      result = `ICS has a "core curriculum", and Level 4 students have not only finished it, but they have also thought beyond mere competency. 
      
The criteria for **Level 4** is ${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'three':
      // eslint-disable-next-line max-len
      result = `With any luck, you'll achieve Level 3 after you complete your second semester of ICS coursework, as long as your grades are good. 
      
The criteria for **Level 3** is ${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    case 'two':
      // eslint-disable-next-line max-len
      result = `Successfully finish your first semester of ICS coursework. 
      
The criteria for **Level 2** is ${getLevelCriteriaStringMarkdown(level)}.`;
      break;
    default:
      // eslint-disable-next-line max-len
      result = 'You begin your RadGrad experience at Level 1, and you will receive this laptop sticker when you first sign up for RadGrad with your advisor. *"A journey of a thousand miles begins with a single step" -- Lao Tzu*';
  }
  return result;
}
