import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Courses } from '../../../api/course/CourseCollection';

const courseFilterKeys = {
  none: 'none',
  threeHundredPLus: '300+',
  fourHundredPlus: '400+',
  sixHundredPlus: '600+',
};

Template.Landing_Card_Explorer_Courses_Widget.onCreated(function landingCardExplorerCoursesWidgetOnCreated() {
  this.filter = new ReactiveVar(courseFilterKeys.none);
});

Template.Landing_Card_Explorer_Courses_Widget.helpers({
  courses() {
    const courses = Courses.findNonRetired({}, { sort: { number: 1 } });
    let visibleCourses = courses;
    switch (Template.instance().filter.get()) {
      case courseFilterKeys.threeHundredPLus:
        visibleCourses = _.filter(visibleCourses, (c) => {
          const num = parseInt(c.number.split(' ')[1], 10);
          return num >= 300;
        });
        break;
      case courseFilterKeys.fourHundredPlus:
        visibleCourses = _.filter(visibleCourses, (c) => {
          const num = parseInt(c.number.split(' ')[1], 10);
          return num >= 400;
        });
        break;
      case courseFilterKeys.sixHundredPlus:
        visibleCourses = _.filter(visibleCourses, (c) => {
          const num = parseInt(c.number.split(' ')[1], 10);
          return num >= 600;
        });
        break;
      default:
      // do nothing.

    }
    return visibleCourses;
  },
  courseFilter() {
    return Template.instance().filter;
  },
  itemCount() {
    return Template.instance().view.template.__helpers[' courses']().length;
  },
});
