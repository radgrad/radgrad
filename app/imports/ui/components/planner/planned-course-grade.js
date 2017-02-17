import { Template } from 'meteor/templating';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { plannerKeys } from './academic-plan';

Template.Planned_Course_Grade.helpers({
  hasGrade(courseInstanceID) {
    const ci = CourseInstances.findDoc(courseInstanceID);
    return ci.grade !== '***';
  },
  isGrade(courseInstanceID, grade) {
    try {
      const ci = CourseInstances.findDoc(courseInstanceID);
      return ci.grade === grade;
      /* eslint no-unused-vars: "off" */
    } catch (e) {
      return null;
    }
  },
});

Template.Planned_Course_Grade.events({
  'click .item.grade': function clickItemGrade(event) {
    event.preventDefault();
    const template = Template.instance();
    const div = event.target.parentElement.parentElement;
    const grade = div.childNodes[1].value;
    // const logger = new Logger('semester-list.clickItemGrade');
    // eslint-disable-next-line max-len
    // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} about to call CourseInstances.clientUpdateGrade(${div.id}, ${grade})`);
    CourseInstances.clientUpdateGrade(div.id, grade);
    const ci = CourseInstances.findDoc(div.id);
    // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} find returned id: ${ci._id} with grade ${ci.grade}`);
    template.state.set(plannerKeys.detailICE, ci.ice);
    // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} set ICE to {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}}`);
    template.state.set(plannerKeys.detailCourseInstance, ci);
    // eslint-disable-next-line max-len
    // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}} ${ci.grade} ${template.state.get(plannerKeys.detailCourseInstance).grade}`);
  },
});

Template.Planned_Course_Grade.onCreated(function plannedCourseGradeOnCreated() {
  if (this.data) {
    this.state = this.data.dictionary;
  }
});

Template.Planned_Course_Grade.onRendered(function plannedCourseGradeOnRendered() {
  // add your statement here
});

Template.Planned_Course_Grade.onDestroyed(function plannedCourseGradeOnDestroyed() {
  // add your statement here
});

