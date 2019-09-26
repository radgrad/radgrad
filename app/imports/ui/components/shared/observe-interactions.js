import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Template } from 'meteor/templating';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { ROLE } from '../../../api/role/Role';
import { getRouteUserName } from '../shared/route-user-name';

let cursorHandle;

/**
 * Starts an observer when a student loads Student_Layout after logging in.
 * Changes made to a StudentProfileCollection doc from a client with a student role will be
 * considered a user interaction and added to UserInteractionCollection.  Fields from a
 * StudentProfileCollection doc that students can update must be added as a switch case
 * to avoid default behavior.  Observer is stopped upon closing page.
 */

Template.Observe_Interactions.helpers({
  startObserve() {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), [ROLE.STUDENT])) {
      const studentDocumentsCursor = StudentProfiles.find({ userID: `${Meteor.userId()}` });
      cursorHandle = studentDocumentsCursor.observeChanges({
        changed: function (id, field) {
          // console.log(field);
          _.each(field, function (value, key) {
            const username = getRouteUserName();
            const type = key;
            const typeData = (function (interactionType) {
              switch (interactionType) {
                case 'interestIDs':
                  return _.map(value, docID => Interests.getSlug(`${docID}`));
                case 'careerGoalIDs':
                  return _.map(value, docID => CareerGoals.getSlug(`${docID}`));
                case 'academicPlanID':
                  if (value) {
                    return _.map([value], docID => AcademicPlans.findSlugByID(`${docID}`));
                  }
                  return [];
                case 'declaredSemesterID':
                  return _.map([value], docID => Semesters.getSlug(`${docID}`));
                case 'picture':
                  return value;
                case 'website':
                  return value;
                default:
                  return null;
              }
            }(type));
            const interactionData = { username, type, typeData };
            if (typeData !== null) {
              setTimeout(function () {
                if (Meteor.userId()) {
                  userInteractionDefineMethod.call(interactionData, (error) => {
                    if (error) {
                      console.log('Error creating UserInteraction.', error);
                    }
                  });
                }
              }, 0);
            }
          });
        },
      });
    }
  },
});

Template.Observe_Interactions.onDestroyed(function () {
  cursorHandle.stop();
});
