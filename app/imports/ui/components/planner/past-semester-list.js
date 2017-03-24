import { Template } from 'meteor/templating';
import { plannerKeys } from './academic-plan';

// import { moment } from 'meteor/momentjs:moment';
// import { Logger } from 'meteor/jag:pince';
// const pl = new Logger('PL');

Template.Past_Semester_List.onCreated(function pastSemesterListOnCreated() {
  // eslint-disable-next-line
  // pl.debug(`${moment().format('YYYY/MM/DD HH:mm:ss.SSS')} Past_Semester_List onCreated`);
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
      // eslint-disable-next-line max-len
      // logger.info(`${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')} {${ci.ice.i}, ${ci.ice.c}, ${ci.ice.e}} ${ci.grade}`);
      template.state.set(plannerKeys.detailCourse, null);
      template.state.set(plannerKeys.detailCourseInstance, ci);
      template.state.set(plannerKeys.detailICE, ci.ice);
      template.state.set(plannerKeys.detailOpportunity, null);
      template.state.set(plannerKeys.detailOpportunityInstance, null);
    } else
      if (firstClass === 'opportunityInstance') {
        const oi = template.data.semesterOpportunities[target.id];
        template.state.set(plannerKeys.detailOpportunity, null);
        template.state.set(plannerKeys.detailOpportunityInstance, oi);
        template.state.set(plannerKeys.detailICE, oi.ice);
        template.state.set(plannerKeys.detailCourse, null);
        template.state.set(plannerKeys.detailCourseInstance, null);
      }
  },
});
