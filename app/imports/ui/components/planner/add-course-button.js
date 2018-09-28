import { Template } from 'meteor/templating';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { buildSimpleName } from '../../../api/degree-plan/PlanChoiceUtilities';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { getRouteUserName } from '../shared/route-user-name';
import { plannerKeys } from './academic-plan';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

Template.Add_Course_Button.onCreated(function addCourseButtonOnCreated() {
  this.state = this.data.dictionary;
});

Template.Add_Course_Button.helpers({
  courseName() {
    try {
      return buildSimpleName(Slugs.getNameFromID(this.course.slugID));
    } catch (e) {
      return '';
    }
  },
  equals(a, b) {
    return a === b;
  },
  slug() {
    try {
      const slug = Slugs.findDoc(this.course.slugID);
      return slug.name;
    } catch (e) {
      return '';
    }
  },
});

Template.Add_Course_Button.events({
  'click .removeFromPlan': function clickItemRemoveFromPlan(event) {
    event.preventDefault();
    const course = this.course;
    const instance = Template.instance();
    const ci = instance.state.get(plannerKeys.detailCourseInstance);
    instance.state.set(plannerKeys.detailCourse, course);
    instance.state.set(plannerKeys.detailCourseInstance, null);
    instance.state.set(plannerKeys.detailOpportunity, null);
    instance.state.set(plannerKeys.detailOpportunityInstance, null);
    const collectionName = CourseInstances.getCollectionName();
    removeItMethod.call({ collectionName, instance: ci._id }, (error) => {
      if (!error) {
        FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
        FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
        FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
        getFutureEnrollmentMethod.call(course._id, (err, result) => {
          if (err) {
            console.log('Error in getting future enrollment', err);
          } else
            if (course._id === result.courseID) {
              instance.state.set(plannerKeys.plannedEnrollment, result);
            }
        });
      }
    });
    const interactionData = { username: getRouteUserName(), type: 'removeCourse',
      typeData: Slugs.getNameFromID(course.slugID) };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});
