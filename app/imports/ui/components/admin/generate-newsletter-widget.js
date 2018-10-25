import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { sendEmailMethod } from '../../../api/analytic/Email.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';

const iceMap = {
  i: {
    name: 'Innovation', color: '#80ad27',
    low: 'You are lacking in Innovation! Consider adding some research opportunities or other' +
    ' innovation-related activities to strengthen this area.',
    med: 'You are showing growth in Innovation. Consider adding some research opportunities or other' +
    ' innovation-related activities to strengthen this area.',
    high: 'You are close to achieving 100 points in Innovation! Add a few more innovation-related opportunities' +
    ' to top this area off.',
  },
  c: {
    name: 'Competency', color: '#26407c',
    low: 'You are lacking in Competency. Go to your Degree Planner and flesh out your academic plan by adding' +
    ' more courses to strengthen this area.',
    med: 'You are showing some Competency in your degree plan. Go to your Degree Planner and flesh out your' +
    ' academic plan by adding more courses.',
    high: 'You are showing great Competency! Add a few more courses to get to 100 points.',
  },
  e: {
    name: 'Experience', color: '#952263',
    low: 'You are lacking in Experience! Add some profession-related opportunities to show' +
    ' that you are ready to work in a professional environment.',
    med: 'You have some professional development in your degree plan. To increase your Experience points' +
    ' and show that you are ready to work in a professional environment, add some profession-related' +
    ' opportunities.',
    high: 'You are showing a great amount of Experience in your degree plan! Add a few more' +
    ' profession-related opportunities to top this area off and reach 100 Experience points!',
  },
};

const levelMap = {
  1: 'You are currently level 1. To get to level 2, finish your first semester of ICS' +
  ' coursework and then go see your advisor to confirm the completion of your courses and pick up' +
  ' a new laptop sticker!',
  2: 'You are currently level 2. To get to the next level, complete your second semester of ICS' +
  ' coursework, though that alone may not be enough! Venture out and complete some opportunities, get them' +
  ' verified by your advisor, and then you may find yourself at the next level.',
  3: 'Now that you are well into your academic career, it\'s time to plan further' +
  ' ahead. Complete your degree plan by adding enough courses and opportunities to reach 100 ICE points. Finish' +
  ' a bit more coursework and get a few more verified opportunities, and you\'ll get to level 4! Don\'t forget' +
  ' to update your RadGrad profile too... That new sticker depends on it.',
  4: 'At level 4, you have not only shown great competency through your coursework, but you have also shown' +
  ' innovation and experience through your opportunities. Continue with your curriculum, focus on verifying even' +
  ' more opportunities, and help your peers out by leaving reviews for courses and opportunities' +
  ' that you have completed. By doing so, you may find yourself at a rare level.',
  5: 'You are a veteran in the ICS community. The finish line is in sight, at least for your undergraduate career.' +
  ' But don\'t slow down! Take part in more opportunities to really show that you are ready for a professional life' +
  ' after college, and don\'t forget to leave more reviews to help guide your peers to the next level. There is a' +
  ' possibility that at the end of all this, you will achieve the rarest RadGrad honor.',
  6: 'You have reached the level of ICS elites. At level 6, you have shown that there is little holding you back' +
  ' from a successful future in computer science, whether it\'s joining the workforce or entering Graduate School.' +
  ' Congratulations on your journey! If you have not already done so, pick up your new RadGrad sticker and show it' +
  ' off proudly!',
};

function iceRecHelper(student, value, component) {
  let html = '';
  if (value >= 100) {
    html += `Congratulations! You have achieved 100 ${iceMap[component].name} points!`;
    return html;
  } else
    if (value < 30) {
      html += iceMap[component].low;
    } else
      if (value < 60) {
        html += iceMap[component].med;
      } else {
        html += iceMap[component].high;
      }
  const studentInterests = Users.getInterestIDs(student.userID);
  if (component === 'c') {
    if (studentInterests.length === 0) {
      html += ' <em>Add some interests so we can provide course recommendations!</em>';
      return html;
    }
    const relevantCourses = _.filter(Courses.find().fetch(), function (course) {
      if (_.some(course.interestIDs, interest => _.includes(studentInterests, interest))) {
        return true;
      }
      return false;
    });
    const currentCourses = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), 'courseID');
    const recommendedCourses = _.filter(relevantCourses, course => !_.includes(currentCourses, course._id));
    const recCourse = recommendedCourses[0];
    html += ' Check out this recommended course: ';
    html += '<a style="color: #6FBE44; font-weight: bold;"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/courses/${Courses.getSlug(recCourse._id)}">${recCourse.shortName}</a>`;
  } else {
    if (studentInterests.length === 0) {
      html += ' <em>Add some Interests to your profile so we can provide opportunity recommendations!</em>';
      return html;
    }
    const opps = _.filter(Opportunities.find().fetch(), function (opp) {
      return opp.ice[component] > 0;
    });
    const relevantOpps = _.filter(opps, function (opp) {
      if (_.some(opp.interestIDs, interest => _.includes(studentInterests, interest))) {
        return true;
      }
      return false;
    });
    const currentOpps = _.map(OpportunityInstances.find({ studentID: student.userID }).fetch(), 'opportunityID');
    const recommendedOpps = _.filter(relevantOpps, opp => !_.includes(currentOpps, opp._id));
    let recOpp;
    if (recommendedOpps.length === 0) {
      recOpp = relevantOpps[0];
    } else {
      recOpp = recommendedOpps[0];
    }
    html += ' Check out this recommended opportunity: ';
    html += '<a style="color: #6FBE44; font-weight: bold;"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/opportunities/${Opportunities.getSlug(recOpp._id)}">${recOpp.name}</a>`;
  }
  return html;
}

function iceRecommendation(student) {
  const ice = StudentProfiles.getProjectedICE(student.username);
  if (ice.i < 100 && ice.c < 100 && ice.e < 100) {
    return false;
  }
  const html = {};
  html.header = 'FINISH YOUR DEGREE PLAN';
  html.info = '<p>To achieve a complete degree plan, obtain 100 points in each ICE component!</p>';
  _.each(ice, function (value, component) {
    let iceLevel = '';
    if (value < 30) {
      iceLevel = '<span style="color: red;"><strong>LOW</strong></span>';
    } else
      if (value < 60) {
        iceLevel = '<span style="color: orange;"><strong>MEDIUM</strong></span>';
      } else {
        iceLevel = '<span style="color: green;"><strong>HIGH</strong></span>';
      }
    html.info += `<p><span style="color: ${iceMap[component].color}">${iceMap[component].name} (${value})</span>
      : ${iceLevel}</p>`;
    html.info += `<ul><li>${iceRecHelper(student, value, component)}</li></ul>`;
  });
  return html;
}

function levelRecommendation(student) {
  if (student.level > 4) {
    return false;
  }
  const html = {};
  html.header = 'LEVEL UP AND UPGRADE YOUR RADGRAD STICKER';
  html.info = '<img src=' +
      `"https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png"` +
      ' width="100" height="100" style="float: left; margin: 0 10px;">';
  html.info += `<p style="color: #6FBE44;"><strong>Current Level: ${student.level}</strong></p>`;
  html.info += '<p><em>Swing by your advisor\'s office or POST 307 to pick up a laptop sticker for' +
      ' your current level if you haven\'t already!</em></p>';
  html.info += `<p>${levelMap[student.level]}</p>`;
  html.info += '<a style="color: #6FBE44; font-weight: bold"' +
      ' href="https://radgrad.ics.hawaii.edu/">Take me to RadGrad!</a>';
  return html;
}

function verifyOppRecommendation(student) {
  const unverifiedOpps = OpportunityInstances.find({ studentID: student.userID, verified: false }).fetch();
  if (unverifiedOpps.length === 0) {
    return false;
  }
  const html = {};
  html.header = 'VERIFY YOUR OPPORTUNITIES';
  html.info = '<p>You have unverified opportunities. To verify them, visit your RadGrad Degree Planner and' +
      ' click on the <em>Inspector</em> tab to the right. Select the opportunity you want to verify in your planner' +
      ' and it should be displayed in the Inspector, along with an option at the bottom to request verification.' +
      ' There may be additional requirements in addition to requesting the verification. Here is a list of' +
      ' past or current opportunities that you have not yet verified:</p>';
  html.info += '<ul>';
  _.each(unverifiedOpps, function (unverifiedOpp) {
    const semesterID = unverifiedOpp.semesterID;
    const semesterNumber = Semesters.findOne({ _id: semesterID }).semesterNumber;
    const semesterName = Semesters.toString(semesterID, false);
    if (semesterNumber <= Semesters.getCurrentSemesterDoc().semesterNumber) {
      const opp = Opportunities.findOne({ _id: unverifiedOpp.opportunityID });
      const oppSlug = Opportunities.getSlug(opp._id);
      html.info += '<li><a style="color: #6FBE44; font-weight: bold"' +
          ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
          `/explorer/opportunities/${oppSlug}">${opp.name} (${semesterName})</a></li>`;
    }
  });
  html.info += '</ul>';
  return html;
}

/*
function completePlanRecommendation(student) {
  const studentPlanID = student.academicPlanID;
  const planCourseList = _.map(AcademicPlans.findOne({ _id: studentPlanID }).courseList, function (choice) {
    let slug = choice;
    if (_.includes(choice, '-')) {
      slug = choice.substring(0, choice.indexOf('-'));
      return slug;
    }
    return slug;
  });
  console.log(planCourseList);
  const groupedCourseList = _.map(_.groupBy(planCourseList), function (array, key) {
    const matches = key.match(/(?:\()[^]*?(?:\))/g);
    const parensChoices = [];
    let nonParensChoices = key;
    _.each(matches, function (match) {
      parensChoices.push(match);
      nonParensChoices = nonParensChoices.replace(match, '');
    });
    nonParensChoices = _.filter(nonParensChoices.split(','), course => !(course === ''));
    const choiceList = {};
    choiceList.count = [array.length];
    choiceList.courses = parensChoices.concat(nonParensChoices);
    console.log(choiceList);
    return choiceList;
  });
  console.log(groupedCourseList);
  const studentCourseList = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), function (instance) {
    return Courses.getSlug(instance.courseID);
  });
  console.log(studentCourseList);
  const remainingCourses = [];
  _.each(groupedCourseList, function (choices) {
    const remainingChoices = choices;
    _.each(studentCourseList, function (studentCourse) {
      const satisfiedReq = _.find(choices.courses, function (courses) {
        return _.includes(courses, studentCourse);
      });
      if (satisfiedReq) {
        _.pull(remainingChoices.courses, satisfiedReq);
        remainingChoices.count -= 1;
        if (remainingChoices.count === 0) {
          return false;
        }
      }
      return true;
    });
    if (remainingChoices.count !== 0) {
      remainingCourses.push(remainingChoices);
    }
  });
  console.log(remainingCourses);
} */

function completePlanRecommendation(student) {
  const studentPlan = student.academicPlanID;
  // the course list for the student's academic plan
  let courseList = _.map(AcademicPlans.findOne({ _id: studentPlan }).courseList, function (course) {
    let courseSlug;
    // remove dashes at end of each course element
    if (_.includes(course, '-')) {
      courseSlug = course.substring(0, course.indexOf('-'));
      return courseSlug;
    }
    return course;
  });
  // divide choices within an array
  courseList = _.map(courseList, function (choices) {
    const parensChoices = choices.match(/(?:\()[^]*?(?:\))/g);
    let nonParensChoices = choices;
    _.each(parensChoices, function (choice) {
      nonParensChoices = nonParensChoices.replace(choice, '');
    });
    nonParensChoices = _.filter(nonParensChoices.split(','), course => !(course === ''));
    if (parensChoices) {
      return parensChoices.concat(nonParensChoices);
    }
    return nonParensChoices;
  });
  console.log('course list: ', courseList);
  // partition courseList into two arrays: one with 00+ electives and the other without
  const courseListPartition = _.partition(courseList, function (choices) {
    let hasElec = false;
    _.each(choices, function (choice) {
      if (_.includes(choice, '00+')) {
        hasElec = true;
      }
    });
    return !hasElec;
  });
  console.log('req courses: ', courseListPartition);
  const studentCourseList = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), function (instance) {
    return Courses.getSlug(instance.courseID);
  });
  console.log('student courses: ', studentCourseList);
  const groupedCourseList = [];
  _.each(courseListPartition, function (partition) {
    groupedCourseList.push(_.groupBy(partition));
  });
  const remainingCourses = _.map(groupedCourseList[0], function (choices) {
    const list = {};
    list.count = choices.length;
    list.choices = choices[0];
    return list;
  });
  const remainingElectives = _.map(groupedCourseList[1], function (choices) {
    const list = {};
    list.count = choices.length;
  });
  _.each(courseListPartition[0], function (choices) {
    _.each(choices, function (choice) {
      _.each(studentCourseList, function (studentCourse) {
        if (_.includes(choice, studentCourse)) {

        }
      });
    });
  });

  const html = {};
  html.header = 'COMPLETE YOUR ACADEMIC PLAN';
  const planDoc = AcademicPlans.findOne({ _id: student.academicPlanID });
  const planName = planDoc.name;
  const slugName = Slugs.getNameFromID(planDoc.slugID);
  html.info = '<p>Your Current Academic Plan: <a style="color: #6FBE44; font-weight: bold"' +
      ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/explorer/plans/${slugName}">` +
      `${planName}</a></p>`;
  html.info += '<p>Your degree planner shows that you do not' +
      ' have all required coursework planned out yet. Head over to your' +
      ' <a style="color: #6FBE44; font-weight: bold;"' +
      ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/degree-planner">RadGrad degree planner</a>` +
      ' to complete your academic plan, or click on your plan above to find out more information.' +
      ' Provided below is a list of required coursework that you are currently missing.' +
      ' Make sure to double-check the requirements with your advisor!</p>';
  if (remainingCoursework.length > 0) {
    html.info += '<p style="text-decoration: underline;">Missing Courses: </p>';
    html.info += '<ul>';
    _.each(groupedCourses, function (course, key) {
      if (_.includes(key, ',') || course.length > 1) {
        const courseSelection = (key.toUpperCase()).replace(/,/g, ' or ').replace(/_/g, ' ');
        html.info += `<li style="color: red;"><strong>${course.length} from ${courseSelection}</strong></li>`;
      } else {
        const courseName = (key.replace('_', ' ')).toUpperCase();
        html.info += `<li style="color: red;"><strong>${courseName}</strong></li>`;
      }
    });
    html.info += '</ul>';
  }
  return html;
}

function reviewCourseRecommendation(student) {
  const completedCourses = _.map(CourseInstances.find({ studentID: student.userID, verified: true }).fetch(),
      function (instance) {
        return instance.courseID;
      });
  const nonReviewedCourses = _.filter(completedCourses, function (courseID) {
    return !(Reviews.findOne({ studentID: student.userID, revieweeID: courseID }));
  });
  if (nonReviewedCourses.length === 0) {
    return false;
  }
  let suggestedReviewCourses = [];
  const remainingCourses = [];
  _.each(nonReviewedCourses, function (courseID) {
    if (Reviews.findOne({ revieweeID: courseID }) === undefined) {
      suggestedReviewCourses.push(courseID);
    } else {
      remainingCourses.push(courseID);
    }
  });
  suggestedReviewCourses = suggestedReviewCourses.concat(remainingCourses);
  const html = {};
  html.header = 'REVIEW COURSES YOU HAVE COMPLETED';
  html.info = '<p>Contribute to the ICS community by providing reviews for courses you have completed.' +
      ' Here are some suggested courses to review:</p>';
  html.info += '<ul>';
  _.each(suggestedReviewCourses, function (courseID, index) {
    if (index === 3) {
      return false;
    }
    const courseSlug = Courses.getSlug(courseID);
    const courseName = Courses.findDocBySlug(courseSlug).shortName;
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/courses/${courseSlug}">${courseName}</a></li>`;
    return true;
  });
  html.info += '</ul>';
  return html;
}

function reviewOppRecommendation(student) {
  const completedOpps = _.map(OpportunityInstances.find({ studentID: student.userID, verified: true }).fetch(),
      function (instance) {
        return instance.opportunityID;
      });
  const nonReviewedOpps = _.filter(completedOpps, function (oppID) {
    return !(Reviews.findOne({ studentID: student.userID, revieweeID: oppID }));
  });
  if (nonReviewedOpps.length === 0) {
    return false;
  }
  let suggestedReviewOpps = [];
  const remainingOpps = [];
  _.each(nonReviewedOpps, function (oppID) {
    if (Reviews.findOne({ revieweeID: oppID }) === undefined) {
      suggestedReviewOpps.push(oppID);
    } else {
      remainingOpps.push(oppID);
    }
  });
  suggestedReviewOpps = suggestedReviewOpps.concat(remainingOpps);
  suggestedReviewOpps = _.uniq(suggestedReviewOpps);
  const html = {};
  html.header = 'REVIEW OPPORTUNITIES YOU HAVE COMPLETED';
  html.info = '<p>Contribute to the ICS community by providing reviews for opportunities you have completed.' +
      ' Here are some suggested opportunities to review:</p>';
  html.info += '<ul>';
  _.each(suggestedReviewOpps, function (oppID, index) {
    if (index === 3) {
      return false;
    }
    const oppSlug = Opportunities.getSlug(oppID);
    const oppName = Opportunities.findDocBySlug(oppSlug).name;
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"' +
        ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/opportunities/${oppSlug}">${oppName}</a></li>`;
    return true;
  });
  html.info += '</ul>';
  return html;
}

function visitMentorRecommendation(student) {
  const html = {};
  html.header = 'VISIT THE MENTOR SPACE';
  html.info = '<p>Connect with RadGrad mentors to learn more about future opportunities and careers, or if you simply' +
      ' have questions regarding your current degree track. Visit the <a style="color: #6FBE44; font-weight: bold"' +
      ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/mentor-space">Mentor Space</a>` +
      ' page to get started!</p>';
  return html;
}

const recList = [iceRecommendation, verifyOppRecommendation, levelRecommendation, completePlanRecommendation,
  reviewCourseRecommendation, reviewOppRecommendation, visitMentorRecommendation];

Template.Generate_Newsletter_Widget.events({
  'click .ui.test.button': function sendEmail(event) {
    event.preventDefault();
    const emailList = $('#email-list').val();
    const emailListArray = _.map(emailList.split(','), email => email.trim());
    _.each(emailListArray, function (email) {
      const student = StudentProfiles.findByUsername(email);
      if (student) {
        const emailData = {};
        emailData.to = 'weng@hawaii.edu';
        emailData.cc = ['cmoore@hawaii.edu', 'johnson@hawaii.edu'];
        emailData.from = 'deedubs.testing@gmail.com';
        emailData.subject = `Newsletter View For ${student.firstName} ${student.lastName}`;
        emailData.templateData = {
          firstName: `${student.firstName}`,
          firstRec: iceRecommendation(student),
          secondRec: verifyOppRecommendation(student),
          thirdRec: levelRecommendation(student),
          fourthRec: completePlanRecommendation(student),
        };
        sendEmailMethod.call(emailData, (error) => {
          if (error) {
            console.log('Error sending email.', error);
          }
        });
      }
    });
  },
});
