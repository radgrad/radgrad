import { Template } from 'meteor/templating';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { buildSimpleName } from '../../../api/degree-plan/PlanChoiceUtilities';
import { getUserIdFromRoute } from '../shared/get-user-id-from-route';
import { plannerKeys } from './academic-plan';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/planner/Add_Course_Button */

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
    const ci = Template.instance().state.get(plannerKeys.detailCourseInstance);
    Template.instance().state.set(plannerKeys.detailCourse, course);
    Template.instance().state.set(plannerKeys.detailCourseInstance, null);
    Template.instance().state.set(plannerKeys.detailOpportunity, null);
    Template.instance().state.set(plannerKeys.detailOpportunityInstance, null);
    const collectionName = CourseInstances.getCollectionName();
    const semester = Semesters.toString(ci.semesterID);
    removeItMethod.call({ collectionName, instance: ci._id }, (error) => {
      if (!error) {
        FeedbackFunctions.checkPrerequisites(getUserIdFromRoute());
        FeedbackFunctions.checkCompletePlan(getUserIdFromRoute());
        FeedbackFunctions.generateRecommendedCourse(getUserIdFromRoute());
      }
    });
    const message = `${getRouteUserName()} removed ${course.name} in ${semester} from their Degree Plan.`;
    appLog.info(message);
  },
});
