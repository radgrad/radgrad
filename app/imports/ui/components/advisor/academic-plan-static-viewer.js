import { Template } from 'meteor/templating';

/* global window */

Template.Academic_Plan_Static_Viewer.helpers({
  courses(yearNumber, semesterNumber) {
    window.camDebugging.start('AcademicPlanStaticViewer.courses');
    const ret = [];
    const totalSem = (3 * yearNumber) + semesterNumber;
    // console.log(`courses(${yearNumber}, ${semesterNumber}) ${totalSem}`);
    const plan = Template.instance().data.plan;
    const numCoursesList = plan.coursesPerSemester.slice(0);
    const numCourses = numCoursesList[totalSem];
    const courseList = plan.courseList.slice(0);
    let i = 0;
    for (i = 0; i < totalSem; i += 1) {
      courseList.splice(0, numCoursesList[i]);
    }
    // console.log(numCourses, courseList);
    for (i = 0; i < numCourses; i += 1) {
      const course = courseList.splice(0, 1);
      ret.push(course[0]);
    }
    window.camDebugging.stop('AcademicPlanStaticViewer.courses');
    return ret;
  },
  hasSummer(yearNum) {
    window.camDebugging.start('AcademicPlanStaticViewer.hasSummer');
    const plan = Template.instance().data.plan;
    const numCoursesList = plan.coursesPerSemester.slice(0);
    window.camDebugging.stop('AcademicPlanStaticViewer.hasSummer');
    return numCoursesList[(3 * yearNum) + 2] !== 0;
  },
  years() {
    window.camDebugging.start('AcademicPlanStaticViewer.years');
    const plan = Template.instance().data.plan;
    if (plan.coursesPerSemester.length === 15) {
      window.camDebugging.stop('AcademicPlanStaticViewer.years');
      return ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    }
    window.camDebugging.stop('AcademicPlanStaticViewer.years');
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  },
});

Template.Academic_Plan_Static_Viewer.events({
  // add your events here
});

Template.Academic_Plan_Static_Viewer.onRendered(function academicPlanStaticViewerOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Static_Viewer.onDestroyed(function academicPlanStaticViewerOnDestroyed() {
  // add your statement here
});

