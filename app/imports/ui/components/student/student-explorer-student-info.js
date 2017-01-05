import { Template } from 'meteor/templating';
import { AcademicYearInstances } from '../../../api/year/AcademicYearInstanceCollection';
import { Users } from '../../../api/user/UserCollection.js';
import { CareerGoals } from '../../../api/career/CareerGoalCollection.js';
import { Interests } from '../../../api/interest/InterestCollection';
import { getRouteUserName } from '../../components/shared/route-user-name.js';
import { getUserIdFromRoute } from '../../components/shared/get-user-id-from-route';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection.js';
import { Semesters } from '../../../api/semester/SemesterCollection';


Template.Student_Explorer_Student_Info.onCreated(function studentExplorerStudentInfoOnCreated() {
  this.subscribe(AcademicYearInstances.getPublicationName());
  this.subscribe(CareerGoals.getPublicationName());
  this.subscribe(Courses.getPublicationName());
  this.subscribe(CourseInstances.getPublicationName());
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Opportunities.getPublicationName());
  this.subscribe(OpportunityInstances.getPublicationName());
  this.subscribe(Semesters.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

function getCoursesHelper(semester) {
  if (getUserIdFromRoute()) {
    const user = Users.findDoc(getUserIdFromRoute());
    const courses = [];
    const courseInstances = CourseInstances.find({ semesterID: semester._id, studentID: user._id }).fetch();
    courseInstances.forEach((courseInstance) => {
      if (CourseInstances.isICS(courseInstance._id)) {
        courses.push(courseInstance);
      }
    });
    console.log("hello" + courses);
    return courses;
  }
  return null;
}

Template.Student_Explorer_Student_Info.helpers({
  careerGoals() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.careerGoalIDs, (id) => {
        ret.push(CareerGoals.findDoc(id));
      });
    }
    return ret;
  },
  interests() {
    const ret = [];
    if (getRouteUserName()) {
      const user = Users.findDoc({ username: getRouteUserName() });
      _.map(user.interestIDs, (id) => {
        ret.push(Interests.findDoc(id));
      });
    }
    return ret;
  },
  name(item) {
    return item.name;
  },
  years() {
    const studentID = getUserIdFromRoute();
    const ay = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    return ay;
  },
  semesters(year) {
    const yearSemesters = [];
    const semIDs = year.semesterIDs;
    _.map(semIDs, (semID) => {
      yearSemesters.push(Semesters.findDoc(semID));
    });
    return yearSemesters;
  },
  hasCourses(semester) {
    let ret = false;
    console.log(semester);
    if ((getCoursesHelper(semester).length > 0)) {
      ret = true;
    }
    return ret;
  },
  getCourses(semester) {
    return getCoursesHelper(semester);
  },
  opportunitySemesters(opp) {
    const semesters = opp.semesterIDs;
    let semesterNames = '';
    const currentSemesterID = Semesters.getCurrentSemester();
    const currentSemester = Semesters.findDoc(currentSemesterID);
    _.map(semesters, (sem) => {
      if (Semesters.findDoc(sem).sortBy >= currentSemester.sortBy) {
        semesterNames = semesterNames.concat(`${Semesters.toString(sem)}, `);
    }
  });
    return semesterNames.slice(0, -2); // removes unnecessary comma and space
  },
  courseName(c) {
    const course = Courses.findDoc(c.courseID);
    return course.shortName;
  },
  courseNumber(c) {
    const course = Courses.findDoc(c.courseID);
    return course.number;
  },
  opportunityName(opp) {
    const opportunity = Opportunities.findDoc(opp.opportunityID);
    return opportunity.name;
  },
  eventSem(event) {
    const sem = Semesters.findDoc(event.semesterID);
    const oppTerm = sem.term;
    const oppYear = sem.year;
    return `${oppTerm} ${oppYear}`;
  },
  printSemester(semester) {
    return Semesters.toString(semester._id, false);
  },
});
