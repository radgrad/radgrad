import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { Users } from '../../../api/user/UserCollection';

Template.Student_Timeline_Modal.helpers({
  behaviors(session) {
    const actions = { login: [], careerGoalIDs: [], interestIDs: [], academicPlanID: [], pageView: [],
      addCourse: [], removeCourse: [], addOpportunity: [], removeOpportunity: [], verifyRequest: [],
      addReview: [], askQuestion: [], level: [], picture: [], website: [] };
    _.each(session, function (interaction) {
      actions[interaction.type].push(interaction.typeData.join(', '));
    });
    const behaviors = { 'Log In': [], 'Change Outlook': [], Exploration: [], Planning: [], Verification: [],
      Reviewing: [], Mentorship: [], 'Level Up': [], Profile: [] };
    _.each(actions, function (array, action) {
      if (array.length !== 0) {
        if (action === 'login') {
          behaviors['Log In'].push(`User logged in ${array.length} time(s)`);
        } else if (action === 'careerGoalIDs') {
          behaviors['Change Outlook'].push(`User modified career goals ${array.length} time(s)`);
          behaviors['Change Outlook'].push(`Career goals at end of session: ${_.last(array)}`);
        } else if (action === 'interestIDs') {
          behaviors['Change Outlook'].push(`User modified interests ${array.length} time(s)`);
          behaviors['Change Outlook'].push(`Interests at end of session: ${_.last(array)}`);
        } else if (action === 'academicPlanID') {
          behaviors['Change Outlook'].push(`User modified academic plan ${array.length} time(s)`);
          behaviors['Change Outlook'].push(`Academic plan at end of session: ${_.last(array)}`);
        } else if (action === 'pageView') {
          const explorerPages = { 'career-goals': [], plans: [], opportunities: [], courses: [], users: [],
            interests: [], degrees: [] };
          let visitedMentor = false;
          _.each(array, function (url) {
            if (url.includes('explorer/')) {
              const parsedUrl = url.split('/');
              if (parsedUrl.length > 2) {
                if (parsedUrl[1] === 'users') {
                  parsedUrl[2] = parsedUrl[2].split(/[@%]/)[0];
                }
                explorerPages[parsedUrl[1]].push(parsedUrl[2]);
              }
            } else if (url.includes('mentor-space')) {
              visitedMentor = true;
            }
          });
          _.each(explorerPages, function (pages, pageName) {
            if (!_.isEmpty(pages)) {
              behaviors.Exploration.push(`Entries viewed in explorer/${pageName} : 
              ${_.uniq(pages).join(', ')}`);
            }
          });
          if (visitedMentor) {
            behaviors.Mentorship.push('User visited the Mentor Space page');
          }
        } else if (action === 'addCourse') {
          behaviors.Planning.push(`Added the following courses: ${_.uniq(array)}`);
        } else if (action === 'removeCourse') {
          behaviors.Planning.push(`Removed the following courses: ${_.uniq(array)}`);
        } else if (action === 'addOpportunity') {
          behaviors.Planning.push(`Added the following opportunites: ${_.uniq(array)}`);
        } else if (action === 'removeOpportunity') {
          behaviors.Planning.push(`Removed the following opportunities: ${_.uniq(array)}`);
        } else if (action === 'verifyRequest') {
          behaviors.Verification.push(`Requested verification for: ${_.uniq(array)}`);
        } else if (action === 'addReview') {
          behaviors.Reviewing.push(`Reviewed the following courses: ${_.uniq(array)}`);
        } else if (action === 'askQuestion') {
          behaviors.Mentorship.push(`Asked ${array.length} question(s): `);
          _.each(array, function (question) {
            behaviors.Mentorship.push(`Question: ${question}`);
          });
        } else if (action === 'level') {
          behaviors['Level Up'].push(`Level updated ${array.length} time(s): ${array}`);
        } else if (action === 'picture') {
          behaviors.Profile.push(`User updated their picture ${array.length} time(s)`);
        } else if (action === 'website') {
          behaviors.Profile.push(`User updated their website ${array.length} time(s)`);
        }
      }
    });
    const behaviorsArray = [];
    _.each(behaviors, function (value, key) {
      if (!_.isEmpty(value)) {
        behaviorsArray.push({ type: key, stats: value });
      }
    });
    if (_.isEmpty(behaviorsArray)) {
      behaviorsArray.push({ type: 'No Behavior', stats: ['User browsed RadGrad with no significant behaviors.'] });
    }
    return behaviorsArray;
  },
  name(user) {
    return Users.getFullName(user.username);
  },
  sessions(user) {
    const sessions = [];
    let slicedIndex = 0;
    _.each(user.interactions, function (interaction, index, interactions) {
      if (index !== 0) {
        const prevTimestamp = moment(new Date(interactions[index - 1].timestamp));
        const timestamp = moment(new Date(interaction.timestamp));
        const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
        if (difference >= 10) {
          sessions.push(_.slice(interactions, slicedIndex, index));
          slicedIndex = index;
        }
        if (index === interactions.length - 1) {
          sessions.push(_.slice(interactions, slicedIndex));
        }
      }
    });
    if (sessions.length === 0) {
      sessions.push(user.interactions);
    }
    return sessions;
  },
  sessionDay(session) {
    return moment(session[0].timestamp).utc(-10).format('MMMM Do');
  },
  sessionTime(session) {
    return moment(session[0].timestamp).utc(-10).format('h:mma');
  },
  sessionDuration(session) {
    const firstTimestamp = moment(session[0].timestamp);
    const lastTimestamp = moment(session[session.length - 1].timestamp);
    return moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes().toFixed(2);
  },
});
