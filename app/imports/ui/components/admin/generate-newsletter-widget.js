import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { sendEmailMethod } from '../../../api/analytic/Email.methods';
import { Users } from '../../../api/user/UserCollection';

const iceMap = {
  i: {
    name: 'Innovation', color: '#80ad27',
    low: 'You are lacking in Innovation! Consider adding some research opportunities or other' +
    ' innovation-related activities to strengthen this area. Here is a recommendation to get you started: ',
    med: 'You are showing growth in Innovation. Consider adding some research opportunities or other' +
    ' innovation-related activities to strengthen this area. You may like this opportunity: ',
    high: 'You are close to achieving 100 points in Innovation! Add a few more innovation-related opportunities' +
    ' to top this area off. You may like this opportunity: '
  },
  c: {
    name: 'Competency', color: '#26407c',
    low: 'You are lacking in Competency. Go to your Degree Planner and flesh out your academic plan by adding' +
    ' more courses to strengthen this area. Here is a recommendation to get you started: ',
    med: 'You are showing some Competency in your degree plan. Go to your Degree Planner and flesh out your' +
    ' academic plan by adding more courses. Here is a recommended course: ',
    high: 'You are showing great Competency! Add a few more courses to get to 100 points.' +
    ' Here is a recommendation: '
  },
  e: {
    name: 'Experience', color: '#952263',
    low: 'You are lacking in Experience! Add some profession-related opportunities to show' +
    ' that you are ready to work in a professional environment. Here is a recommendation to get you started: ',
    med: 'You have some professional development in your degree plan. To increase your Experience points' +
    ' and show that you are ready to work in a professional environment, add some profession-related' +
    ' opportunities. You may like this one: ',
    high: 'You are showing a great amount of Experience in your degree plan! Add a few more' +
    ' profession-related opportunities to top this area off and reach 100 Experience points!' +
    ' Here is a recommendation: '
  },
};

const levelMap = { 1: 'You are currently '

}

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
    const relevantCourses = _.filter(Courses.find().fetch(), function (course) {
      if (_.some(course.interestIDs, interest => _.includes(studentInterests, interest))) {
        return true;
      }
      return false;
    });
    const currentCourses = _.map(CourseInstances.find({ studentID: student.userID }).fetch(), 'courseID');
    const recommendedCourses = _.filter(relevantCourses, course => !_.includes(currentCourses, course._id));
    if (studentInterests === 0) {
      recommendedCourses.push('Consider adding some interests so we can provide some course recommendations!');
    }
    const recCourse = recommendedCourses[0];
    html += `<a href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/courses/${Courses.getSlug(recCourse._id)}">${recCourse.shortName}</a>`;
  } else {
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
    console.log(recommendedOpps);
    let recOpp;
    if (recommendedOpps.length === 0) {
      recOpp = relevantOpps[0];
    } else {
      recOpp = recommendedOpps[0];
    }
    html += `<a href="https://radgrad.ics.hawaii.edu/student/${student.username}` +
        `/explorer/opportunities/${Opportunities.getSlug(recOpp._id)}">${recOpp.name}</a>`;
  }
  return html;
}

function iceRecommendation(student) {
  const ice = StudentProfiles.getProjectedICE(student.username);
  const html = {};
  html.header = 'FINISH YOUR DEGREE PLAN';
  html.info = '<p>Please review your ICE points below and update your degree plan to strengthen any area that' +
      ' you currently may be lacking in.</p>';
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

function levelRec(student) {
  const html = {};
  const username = student.username;
  html.header = 'LEVEL UP AND UPGRADE YOUR RADGRAD STICKER';
  html.info = '<img src=' +
      `"https://radgrad.ics.hawaii.edu/images/level-icons/radgrad-level-${student.level}-icon.png"` +
      ' width="200" height="200">';
  switch (student.level) {
    case 1:
      html.info += 'You are currently level 1'

  }
  return html;
}

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
        emailData.from = 'deedubs.testing@gmail.com';
        emailData.subject = `Newsletter View For ${student.firstName} ${student.lastName}`;
        emailData.templateData = {
          firstName: `${student.firstName}`,
          firstRec: iceRecommendation(student),
          secondRec: levelRec(student),
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
