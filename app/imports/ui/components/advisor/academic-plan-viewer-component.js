import { Template } from 'meteor/templating';
import { DesiredDegrees } from '../../../api/degree/DesiredDegreeCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Academic_Plan_Viewer_Component.onCreated(function academicPlanViewerWidgetOnCreated() {
  if (this.data) {
    this.plan = this.data.plan;
  }
});

Template.Academic_Plan_Viewer_Component.helpers({
  courses(yearNumber, semesterNumber) {
    const ret = [];
    if (Template.instance().plan.get()) {
      const totalSem = (3 * yearNumber) + semesterNumber;
      // console.log(`courses(${yearNumber}, ${semesterNumber}) ${totalSem}`);
      const plan = Template.instance().plan.get();
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
        console.log(course[0].planChoice[0].choices);
        ret.push(course[0].planChoice[0].choices[0].choice);
      }
    }
    return ret;
  },
  degreeName() {
    if (Template.instance().plan.get()) {
      return DesiredDegrees.findDoc(Template.instance().plan.get().degreeID).shortName;
    }
    return '';
  },
  fallYear() {
    if (Template.instance().plan.get()) {
      const plan = Template.instance().plan.get();
      const effectiveSemester = Semesters.findDoc(plan.effectiveSemesterID);
      return effectiveSemester.year;
    }
    return '';
  },
  getPlan() {
    return Template.instance().plan.get();
  },
  name() {
    if (Template.instance().plan.get()) {
      const plan = Template.instance().plan.get();
      return plan.name;
    }
    return '';
  },
  springYear() {
    if (Template.instance().plan.get()) {
      const plan = Template.instance().plan.get();
      const effectiveSemester = Semesters.findDoc(plan.effectiveSemesterID);
      return effectiveSemester.year + 1;
    }
    return '';
  },
  years() {
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  },
});

Template.Academic_Plan_Viewer_Component.events({
  // add your events here
});

Template.Academic_Plan_Viewer_Component.onRendered(function academicPlanViewerWidgetOnRendered() {
  // add your statement here
});

Template.Academic_Plan_Viewer_Component.onDestroyed(function academicPlanViewerWidgetOnDestroyed() {
  // add your statement here
});

