import { Template } from 'meteor/templating';
import { plannerKeys } from './academic-plan';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { getRouteUserName } from '../shared/route-user-name';
import { appLog } from '../../../api/log/AppLogCollection';

// /** @module ui/components/planner/Past_Semester_List */

Template.Past_Semester_List.onCreated(function pastSemesterListOnCreated() {
  if (this.data) {
    // use dictionary to indicate what is selected for the Inspector.
    this.state = this.data.dictionary;
  }
});

Template.Past_Semester_List.events({
  'click tr.clickEnabled': function clickTrClickEnabled(event) {
    event.preventDefault();
    let target = event.target;
    while (target && target.nodeName !== 'TR') {
      target = target.parentNode;
    }
    const firstClass = target.getAttribute('class').split(' ')[0];
    const template = Template.instance();
    if (firstClass === 'courseInstance') {
      const ci = template.data.icsCourses[target.id];
      template.state.set(plannerKeys.detailCourse, null);
      template.state.set(plannerKeys.detailCourseInstance, ci);
      template.state.set(plannerKeys.detailICE, ci.ice);
      template.state.set(plannerKeys.detailOpportunity, null);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
      const course = Courses.findDoc(ci.courseID);
      const semester = Semesters.toString(ci.semesterID);
      const message = `${getRouteUserName()} inspected ${ci.note} ${course.shortName} (${semester}).`;
      appLog.info(message);
    } else
      if (firstClass === 'opportunityInstance') {
        const oi = template.data.semesterOpportunities[target.id];
        template.state.set(plannerKeys.detailOpportunity, null);
        template.state.set(plannerKeys.detailOpportunityInstance, oi);
        template.state.set(plannerKeys.detailICE, oi.ice);
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, null);
        const opportunity = Opportunities.findDoc(oi.opportunityID);
        const semester = Semesters.toString(oi.semesterID);
        const message = `${getRouteUserName()} inspected ${opportunity.name} (${semester}).`;
        appLog.info(message);
      }
  },
});
