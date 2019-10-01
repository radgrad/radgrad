import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ReactiveVar } from 'meteor/reactive-var';
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
  } else if (value < 30) {
    html += iceMap[component].low;
  } else if (value < 60) {
    html += iceMap[component].med;
  } else {
    html += iceMap[component].high;
  }
  const studentInterests = Users.getInterestIDs(student.userID);
  if (component === 'c') {
    if (studentInterests.length === 0) {
      html += ' <em><a href="https://radgrad.ics.hawaii.edu">' +
        ' Add some interests so we can provide course recommendations!</a></em>';
      return html;
    }
    const relevantCourses = _.filter(Courses.findNonRetired(), function (course) {
      if (_.some(course.interestIDs, interest => _.includes(studentInterests, interest))) {
        return true;
      }
      return false;
    });
    const currentCourses = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), 'courseID');
    const recommendedCourses = _.filter(relevantCourses, course => !_.includes(currentCourses, course._id));
    if (recommendedCourses.length === 0) {
      html += '<em><a href="https://radgrad.ics.hawaii.edu">' +
        ' Add more interests so we can provide course recommendations!</a></em>';
      return html;
    }
    const recCourse = recommendedCourses[0];
    html += ' Check out';
    html += '<a style="color: #6FBE44; font-weight: bold;"' +
      ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
      `/explorer/courses/${Courses.getSlug(recCourse._id)}"> ${recCourse.shortName}</a>`;
  } else {
    if (studentInterests.length === 0) {
      html += ' <em><a href="https://radgrad.ics.hawaii.edu">' +
        ' Add some Interests to your profile so we can provide opportunity recommendations!</a></em>';
      return html;
    }
    const opps = _.filter(Opportunities.findNonRetired(), function (opp) {
      return opp.ice[component] > 0;
    });
    const relevantOpps = _.filter(opps, function (opp) {
      if (_.some(opp.interestIDs, interest => _.includes(studentInterests, interest))) {
        return true;
      }
      return false;
    });
    if (relevantOpps.length === 0) {
      return ' <em><a href="https://radgrad.ics.hawaii.edu">' +
        ' Add more Interests to your profile so we can provide opportunity recommendations!</a></em>';
    }
    const currentOpps = _.map(OpportunityInstances.find({ studentID: student.userID }).fetch(), 'opportunityID');
    const recommendedOpps = _.filter(relevantOpps, opp => !_.includes(currentOpps, opp._id));
    let recOpp;
    if (recommendedOpps.length === 0) {
      recOpp = relevantOpps[0];
    } else {
      recOpp = recommendedOpps[0];
    }
    html += ' Check out';
    html += '<a style="color: #6FBE44; font-weight: bold;"' +
      ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
      `/explorer/opportunities/${Opportunities.getSlug(recOpp._id)}"> ${recOpp.name}</a>`;
  }
  return html;
}

function iceRecommendation(student) {
  const ice = StudentProfiles.getProjectedICE(student.username);
  if (ice.i >= 100 && ice.c >= 100 && ice.e >= 100) {
    return '';
  }
  const html = {};
  html.header = 'Finish Your Degree Plan';
  html.info = '<p>To achieve a complete degree plan, obtain 100 points in each ICE component!</p>';
  _.each(ice, function (value, component) {
    let iceLevel = '';
    if (value < 30) {
      iceLevel = '<span style="color: red;"><strong>NEEDS WORK</strong></span>';
    } else if (value < 60) {
      iceLevel = '<span style="color: orange;"><strong>NEEDS WORK</strong></span>';
    } else {
      iceLevel = '<span style="color: green;"><strong>GOOD</strong></span>';
    }
    html.info += `<p><span style="color: ${iceMap[component].color}">${iceMap[component].name} (${value} points)</span>
      : ${iceLevel}</p>`;
    html.info += `<ul><li>${iceRecHelper(student, value, component)}</li></ul>`;
  });
  return html;
}

function levelRecommendation(student) {
  if (student.level > 5) {
    return '';
  }
  const html = {};
  html.header = 'Level Up and Upgrade Your RadGrad Sticker';
  html.info = '<img src=' +
    `"https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png"` +
    ' width="100" height="100" style="float: left; margin: 0 10px;">';
  html.info += `<p style="color: #6FBE44;"><strong>Current Level: ${student.level}</strong></p>`;
  html.info += '<p><em>Swing by your advisor\'s office or POST 307 to pick up a laptop sticker for' +
    ' your current level if you haven\'t already!</em></p>';
  html.info += `<p>${levelMap[student.level]}</p>`;
  if (student.level < 6) {
    html.info += '<p>View your <a style="color: #6FBE44; font-weight: bold" ' +
    `href="https://radgrad.ics.hawaii.edu/student/${student.username}/home/levels">Level Page</a>` +
      ' to view specific level requirements.</p>';
  }
  return html;
}

function verifyOppRecommendation(student) {
  const unverifiedOpps = OpportunityInstances.find({ studentID: student.userID, verified: false }).fetch();
  const currentUnverifiedOpps = _.filter(unverifiedOpps, function (unverifiedOpp) {
    const semesterID = unverifiedOpp.semesterID;
    const semesterNumber = Semesters.findOne({ _id: semesterID }).semesterNumber;
    if (semesterNumber <= Semesters.getCurrentSemesterDoc().semesterNumber) {
      return true;
    }
    return false;
  });
  if (currentUnverifiedOpps.length === 0) {
    return '';
  }
  const html = {};
  html.header = 'Verify Your Opportunities';
  html.info = '<p>You have unverified opportunities. To verify them, visit your RadGrad Degree Planner and' +
    ' click on the opportunity with the red question mark.' +
    ' <img src=' +
    '"https://radgrad.ics.hawaii.edu/images/help/degree-planner-unverified-opportunity.png" width="100"> Select ' +
    'the opportunity you want to verify in your planner' +
    ' and it should be displayed in the Details tab, along with an option at the bottom to request verification.' +
    ' You must supply a brief explanation of how you participated. There may be additional requirements in addition ' +
    'to requesting the verification. Here is a list of' +
    ' past or current opportunities that you have not yet verified:</p>';
  html.info += '<ul>';
  _.each(currentUnverifiedOpps, function (unverifiedOpp) {
    const semesterID = unverifiedOpp.semesterID;
    const semesterName = Semesters.toString(semesterID, false);
    const opp = Opportunities.findOne({ _id: unverifiedOpp.opportunityID });
    const oppSlug = Opportunities.getSlug(opp._id);
    html.info += '<li><a style="color: #6FBE44; font-weight: bold"' +
      ` href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
      `/explorer/opportunities/${oppSlug}">${opp.name} (${semesterName})</a></li>`;
  });
  html.info += '</ul>';
  return html;
}

// This is messy code, but is more accurate than the current implementation in the planner.
function completePlanRecommendation(student) {
  const studentPlan = student.academicPlanID;
  if (!studentPlan) {
    return '';
  }
  // the course list for the student's academic plan
  let reqList = _.map(AcademicPlans.findOne({ _id: studentPlan }).courseList, function (course) {
    let courseSlug;
    // remove dashes at end of each course element
    if (_.includes(course, '-')) {
      courseSlug = course.substring(0, course.indexOf('-'));
      return courseSlug;
    }
    return course;
  });
  // divide choices within an array
  reqList = _.map(reqList, function (choices) {
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
  // partition courseList into two arrays: one with 00+ electives and the other without
  const reqListPartition = _.partition(reqList, function (choices) {
    let hasElec = false;
    _.each(choices, function (choice) {
      if (_.includes(choice, '00+')) {
        hasElec = true;
      }
    });
    return !hasElec;
  });
  const studentCourseList = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), function (instance) {
    return Courses.getSlug(instance.courseID);
  });
  const remainingStudentCourses = [];
  _.each(studentCourseList, function (course) {
    const duplicateChoiceIndices = [];
    _.each(reqListPartition[0], function (choices, index) {
      if (_.some(choices, choice => _.includes(choice, course))) {
        duplicateChoiceIndices.push(index);
      }
    });
    if (duplicateChoiceIndices.length > 1) {
      _.each(duplicateChoiceIndices, function (index) {
        _.remove(reqListPartition[0][index], function (choice) {
          return _.includes(choice, course);
        });
      });
      _.pullAt(reqListPartition[0], duplicateChoiceIndices[0]);
    } else if (duplicateChoiceIndices.length === 1) {
      _.pullAt(reqListPartition[0], duplicateChoiceIndices[0]);
    } else {
      remainingStudentCourses.push(course);
    }
  });
  _.each(remainingStudentCourses, function (course) {
    const electified = course.replace(/\d(?=\d?$)/g, '0');
    let choiceIndex;
    _.each(reqListPartition[1], function (choices, index) {
      if (_.some(choices, choice => _.includes(choice, electified))) {
        choiceIndex = index;
        return false;
      }
      return true;
    });
    if (choiceIndex >= 0) {
      _.pullAt(reqListPartition[1], choiceIndex);
    }
  });
  const remainingReqs = _.flatten(reqListPartition);
  if (remainingReqs.length === 0) {
    return '';
  }
  const html = {};
  html.header = 'Complete Your Academic Plan';
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
  if (remainingReqs.length > 0) {
    html.info += '<p style="text-decoration: underline;">Missing Requirements: </p>';
    html.info += '<ul>';
    _.each(remainingReqs, function (req) {
      const requirement = (req.toString().toUpperCase()).replace(/,/g, ' or ').replace(/_/g, ' ');
      html.info += `<li style="color: red;">${requirement}</li>`;
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
    return '';
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
  html.header = 'Review Courses You Have Completed';
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
    return '';
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
  html.header = 'Review Opportunities You Have Completed';
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
  html.header = 'Visit The Mentor Space';
  html.info = '<p>Connect with RadGrad mentors to learn more about future opportunities and careers, or if you simply' +
    ' have questions regarding your current degree track. Visit the <a style="color: #6FBE44; font-weight: bold"' +
    ` href="https://radgrad.ics.hawaii.edu/student/${student.username}/mentor-space">Mentor Space</a>` +
    ' page to get started!</p>';
  return html;
}

const recList = [iceRecommendation, verifyOppRecommendation, levelRecommendation, completePlanRecommendation,
  reviewCourseRecommendation, reviewOppRecommendation, visitMentorRecommendation];

/*
 * Each recommendation function returns html. If '' is returned, then that recommendation will not be
 * included in the recommendation list. There is currently no catch for when there are fewer than three
 * recommendations, which is the amount listed in the newsletter. If there are fewer than three (which is
 * extremely rare, and only for very accomplished RadGraduates), then only those recommendations will be listed,
 * with blank table rows in the newsletter. There is at least one guaranteed recommendation, which is the
 * mentor space recommendation.
 */
function getRecList(student) {
  const suggestedRecs = [];
  _.each(recList, function (func) {
    const html = func(student);
    if (html) {
      suggestedRecs.push(html);
    }
  });
  return suggestedRecs;
}

Template.Generate_Newsletter_Widget.onCreated(function generateNewsletterWidgetOnCreated() {
  this.testEmailStatus = new ReactiveVar('');
  this.levelEmailStatus = new ReactiveVar('');
  this.sendAllEmailStatus = new ReactiveVar('');
  this.adminMessage = new ReactiveVar('');
  this.adminWorking = new ReactiveVar(false);
  this.studentsWorking = new ReactiveVar(false);
  this.allStudentsWorking = new ReactiveVar(false);
});

Template.Generate_Newsletter_Widget.helpers({
  testEmailStatus() {
    return Template.instance().testEmailStatus.get();
  },
  levelEmailStatus() {
    return Template.instance().levelEmailStatus.get();
  },
  sendAllEmailStatus() {
    return Template.instance().sendAllEmailStatus.get();
  },
  adminMessage() {
    return Template.instance().adminMessage.get();
  },
  levelCount(level) {
    return StudentProfiles.find({ level, isAlumni: false }).count();
  },
  adminWorking() {
    return Template.instance().adminWorking.get();
  },
  studentsWorking() {
    return Template.instance().studentsWorking.get();
  },
  allStudentsWorking() {
    return Template.instance().allStudentsWorking.get();
  },
});

Template.Generate_Newsletter_Widget.events({
  'submit .preview': function previewMarkdown(event, instance) {
    event.preventDefault();
    const message = event.target.message.value;
    instance.adminMessage.set(message);
  },
  'submit .test': function sendTestEmail(event, instance) {
    event.preventDefault();
    instance.adminWorking.set(true);
    const emailList = event.target.text.value;
    const emailListArray = _.map(emailList.split(','), email => email.trim());
    if (emailListArray.length === 1 && emailListArray[0] === '') {
      instance.testEmailStatus.set('Please input at least one email');
      instance.adminWorking.set(false);
      return;
    }
    const bccList = $('#bcc-list').val();
    const bccListArray = _.map(bccList.split(','), email => email.trim());
    const adminMessage = $('.markdown').html();
    if (!(adminMessage.match(/[a-z]/i))) {
      instance.testEmailStatus.set('Please input an admin message');
      instance.adminWorking.set(false);
      return;
    }
    instance.testEmailStatus.set('Sending emails...');
    const sendToStudents = event.target['student-checkbox'].checked;
    _.each(emailListArray, function (email) {
      const student = StudentProfiles.findByUsername(email);
      if (student) {
        const suggestedRecs = getRecList(student);
        const sendList = [];
        sendList.push('radgrad@hawaii.edu');
        if (sendToStudents) {
          sendList.push(email);
        }
        const emailData = {};
        emailData.to = sendList;
        emailData.bcc = bccListArray;
        emailData.from = 'RadGrad Administrator <donotreply@mailgun.radgrad.org>';
        emailData.replyTo = 'radgrad@hawaii.edu';
        emailData.subject = `Newsletter View For ${student.firstName} ${student.lastName}`;
        emailData.templateData = {
          adminMessage,
          firstName: student.firstName,
          firstRec: suggestedRecs[0],
          secondRec: suggestedRecs[1],
          thirdRec: suggestedRecs[2],
        };
        emailData.filename = 'newsletter2.html';
        sendEmailMethod.call(emailData, (error) => {
          if (error) {
            console.log('Error sending email.', error);
          }
        });
      }
    });
    instance.testEmailStatus.set('All emails sent!');
    instance.adminWorking.set(false);
  },
  'submit .level': function sendToAdmin(event, instance) {
    event.preventDefault();
    instance.studentsWorking.set(true);
    // console.log('submit .level %o', instance.studentsWorking.get());
    const adminMessage = $('.markdown').html();
    if (!(adminMessage.match(/[a-z]/i))) {
      instance.levelEmailStatus.set('Please input an admin message');
      instance.studentsWorking.set(false);
      return;
    }
    const subject = $('#subject-field').val();
    if (!subject) {
      instance.levelEmailStatus.set('Please input a subject line');
      instance.studentsWorking.set(false);
      return;
    }
    if (!event.target['confirm-checkbox'].checked) {
      instance.levelEmailStatus.set('Please check the send confirmation box');
      instance.studentsWorking.set(false);
      return;
    }
    const level = parseInt(event.target['level-dropdown'].value, 10);
    if (!level) {
      instance.levelEmailStatus.set('Please select a level');
      instance.studentsWorking.set(false);
      return;
    }
    $('.ui.dropdown').dropdown('clear');
    const studentsByLevel = StudentProfiles.find({ level, isAlumni: false }).fetch();
    const lastIndex = studentsByLevel.length - 1;
    const bccList = $('#bcc-list').val();
    const bccListArray = _.map(bccList.split(','), email => email.trim());
    _.each(studentsByLevel, function (profile, index) {
      setTimeout(function () {
        const student = profile;
        const email = student.username;
        instance.levelEmailStatus.set(`Level ${level}: Sending newsletter for ${email}...`);
        if (student) {
          const suggestedRecs = getRecList(student);
          const emailData = {};
          console.log(`Sending email to ${email}`);
          emailData.to = email;
          emailData.bcc = bccListArray;
          emailData.from = 'RadGrad Administrator <donotreply@mailgun.radgrad.org>';
          emailData.replyTo = 'radgrad@hawaii.edu';
          emailData.subject = subject;
          emailData.templateData = {
            adminMessage,
            firstName: `${student.firstName}`,
            firstRec: suggestedRecs[0],
            secondRec: suggestedRecs[1],
            thirdRec: suggestedRecs[2],
          };
          emailData.filename = 'newsletter2.html';
          sendEmailMethod.call(emailData, (error) => {
            if (error) {
              console.log('Error sending email.', error);
            }
          });
        }
        if (index === lastIndex) {
          instance.levelEmailStatus.set(`Level ${level}: All emails sent!`);
          instance.studentsWorking.set(false);
        }
      }, index * 1000);
    });
  },
  'submit .all': function sendToAllStudents(event, instance) {
    event.preventDefault();
    instance.allStudentsWorking.set(true);
    const adminMessage = $('.markdown').html();
    if (!(adminMessage.match(/[a-z]/i))) {
      instance.sendAllEmailStatus.set('Please input an admin message');
      instance.allStudentsWorking.set(false);
      return;
    }
    const subject = $('#subject-field').val();
    if (!subject) {
      instance.sendAllEmailStatus.set('Please input a subject line');
      instance.allStudentsWorking.set(false);
      return;
    }
    if (!event.target['confirm-checkbox'].checked) {
      instance.sendAllEmailStatus.set('Please check the send confirmation box');
      instance.allStudentsWorking.set(false);
      return;
    }
    $('.ui.dropdown').dropdown('clear');
    const students = StudentProfiles.find({ isAlumni: false }).fetch();
    const lastIndex = students.length - 1;
    const bccList = $('#bcc-list').val();
    const bccListArray = _.map(bccList.split(','), email => email.trim());
    _.each(students, function (profile, index) {
      setTimeout(function () {
        const student = profile;
        const email = student.username;
        instance.sendAllEmailStatus.set(`Sending newsletter for ${email}...`);
        if (student) {
          const suggestedRecs = getRecList(student);
          const emailData = {};
          console.log(`Sending email to ${email}`);
          emailData.to = email;
          emailData.bcc = bccListArray;
          emailData.from = 'RadGrad Administrator <donotreply@mailgun.radgrad.org>';
          emailData.replyTo = 'radgrad@hawaii.edu';
          emailData.subject = subject;
          emailData.templateData = {
            adminMessage,
            firstName: `${student.firstName}`,
            firstRec: suggestedRecs[0],
            secondRec: suggestedRecs[1],
            thirdRec: suggestedRecs[2],
          };
          emailData.filename = 'newsletter2.html';
          sendEmailMethod.call(emailData, (error) => {
            if (error) {
              console.log('Error sending email.', error);
            }
          });
        }
        if (index === lastIndex) {
          instance.sendAllEmailStatus.set('All emails sent!');
          instance.allStudentsWorking.set(false);
        }
      }, index * 1000);
    });
  },
});

Template.Generate_Newsletter_Widget.onRendered(function generateNewsletterWidgetOnRendered() {
  this.$('.ui.dropdown').dropdown();
  this.$('.ui.checkbox').checkbox();
});
