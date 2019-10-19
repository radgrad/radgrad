import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { getDefinitions } from '../test/test-utilities';
import { Slugs } from '../slug/SlugCollection';
import { UserInteractions } from '../analytic/UserInteractionCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Courses } from '../course/CourseCollection';
import { Users } from '../user/UserCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { PlanChoices } from '../degree-plan/PlanChoiceCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../help/HelpMessageCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection';
import { MentorAnswers } from '../mentor/MentorAnswerCollection';
import { MentorQuestions } from '../mentor/MentorQuestionCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { MentorProfiles } from '../user/MentorProfileCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';

/**
 * Given a collection and the loadJSON structure, looks up the definitions and invokes define() on the definitions
 * that are not in the collection.
 * @param collection The collection to be loadd.
 * @param loadJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 * @memberOf api/utilities
 */
export function loadCollectionNewDataOnly(collection, loadJSON, consolep) {
  const type = collection.getType();
  // console.log(`loadCollectionNewDataOnly(${type}, ${loadJSON}`);
  const definitions = getDefinitions(loadJSON, collection._collectionName);
  // console.log(`${definitions.length} definitions for ${type}`);
  let count = 0;
  _.each(definitions, definition => {
    switch (type) {
      case UserInteractions.getType():
        if (UserInteractions.find({
          username: definition.username,
          type: definition.type,
          typeData: definition.typeData,
          timestamp: definition.timestamp,
        })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case CourseInstances.getType(): {
        const semesterID = Semesters.getID(definition.semester);
        const courseID = Courses.getID(definition.course);
        const studentID = Users.getID(definition.student);
        if (CourseInstances.find({ semesterID, courseID, studentID })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case AcademicYearInstances.getType(): {
        const studentID = Users.getID(definition.student);
        if (AcademicYearInstances.find({ year: definition.year, studentID })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case PlanChoices.getType():
        if (PlanChoices.find({ choice: definition.choice })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case Feeds.getType():
        if (Feeds.find({
          feedType: definition.feedType,
          description: definition.description,
          timestamp: definition.timestamp,
        }).count === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case FeedbackInstances.getType(): {
        const userID = Users.getID(definition.user);
        if (FeedbackInstances.find({
          userID,
          functionName: definition.functionName,
          description: definition.description,
          feedbackType: definition.feedbackType,
        })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case HelpMessages.getType():
        if (HelpMessages.find({ routeName: definition.routeName })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case AdvisorLogs.getType(): {
        const advisorID = Users.getID(definition.advisor);
        const studentID = Users.getID(definition.student);
        if (AdvisorLogs.find({
          advisorID, studentID, text: definition.text, createdOn: definition.createdOn,
        })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case MentorAnswers.getType(): {
        const questionID = MentorQuestions.getID(definition.question);
        const mentorID = Users.getID(definition.mentor);
        if (MentorAnswers.find({ questionID, mentorID, text: definition.text })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case OpportunityInstances.getType(): {
        const semesterID = Semesters.getID(definition.semester);
        const studentID = Users.getID(definition.student);
        const opportunityID = Opportunities.getID(definition.opportunity);
        if (OpportunityInstances.find({ semesterID, studentID, opportunityID })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case AdvisorProfiles.getType():
      case FacultyProfiles.getType():
      case MentorProfiles.getType():
      case StudentProfiles.getType():
        if (collection.find({ username: definition.username })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case VerificationRequests.getType(): {
        const studentID = Users.getID(definition.student);
        const oppInstance = definition.opportunityInstance ? OpportunityInstances.findDoc(definition.opportunityInstance) : // eslint-disable-line
          OpportunityInstances.findOpportunityInstanceDoc(definition.semester, definition.opportunity, definition.student); // eslint-disable-line
        if (!oppInstance) {
          throw new Meteor.Error('Could not find the opportunity instance to associate with this verification request',
            '', Error().stack);
        }
        const opportunityInstanceID = oppInstance._id;
        if (VerificationRequests.find({ studentID, opportunityInstanceID }).count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      default: // Slug collections
        if ('slug' in definition) {
          if (!Slugs.isDefined(definition.slug, type)) {
            collection.define(definition);
            count++;
          }
        }
    }
  });
  let ret;
  if (count > 1) {
    ret = `Defined ${count} ${type}s`;
  } else if (count === 1) {
    ret = `Defined a ${type}`;
  } else {
    ret = '';
  }
  if (consolep) {
    // console.log(count, `<${ret}>`);
  }
  return ret;
}
