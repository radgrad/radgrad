import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as semUtils from '../semester/SemesterUtilities';
import * as courseUtils from '../course/CourseFunctions';


export function generateCoursePlan(template, startSemester, student) {
  const plan = {};
  const studentID = student._id;
  const instances = CourseInstances.find({ studentID }).fetch();
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  // year 1
  let semester = startSemester;
  let semesterCourses = template.ay1.fallSem;
  let semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  _.map(semesterCourses, (slug) => {
    const courseID = Courses.getID(slug);
    const course = Courses.findDoc(courseID);
    if (_.indexOf(courseTakenIDs, course._id) === -1) {
      plan[semStr].push(course.shortName);
      courseTakenIDs.push(course._id);
    }
  });
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay1.springSem;
  _.map(semesterCourses, (slug) => {
    // console.log(typeof slug);
    const courseID = Courses.getID(slug);
    const course = Courses.findDoc(courseID);
    if (_.indexOf(courseTakenIDs, course._id) === -1) {
      plan[semStr].push(course.shortName);
      courseTakenIDs.push(course._id);
    }
  });
  // year 2
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay2.fallSem;
  _.map(semesterCourses, (slug) => {
    const courseID = Courses.getID(slug);
    const course = Courses.findDoc(courseID);
    if (_.indexOf(courseTakenIDs, course._id) === -1) {
      plan[semStr].push(course.shortName);
      courseTakenIDs.push(course._id);
    }
  });
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay2.springSem;
  _.map(semesterCourses, (slug) => {
    const courseID = Courses.getID(slug);
    const course = Courses.findDoc(courseID);
    if (_.indexOf(courseTakenIDs, course._id) === -1) {
      plan[semStr].push(course.shortName);
      courseTakenIDs.push(course._id);
    }
  });
  // year 3
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay3.fallSem;
  _.map(semesterCourses, (slug) => {
    const interests = student.interestIDs;
    let choices = [];
    if (slug.endsWith('3xx')) {
      if (interests) {
        _.map(interests, function findInteresting(interestID) {
          choices = _.concat(choices, courseUtils.get300LevelChoices(interestID, studentID));
        });
        console.log(choices);
      }
    } else
      if (slug.endsWith('4xx')) {
        if (interests) {
          _.map(interests, function findInteresting(interestID) {
            choices = _.concat(choices, courseUtils.get400LevelChoices(interestID, studentID));
          });
          console.log(choices);
        }
      } else {
        // console.log(typeof slug);
        const courseID = Courses.getID(slug);
        const course = Courses.findDoc(courseID);
        if (_.indexOf(courseTakenIDs, course._id) === -1) {
          plan[semStr].push(course.shortName);
          courseTakenIDs.push(course._id);
        }
      }
  });
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay3.springSem;
  _.map(semesterCourses, (slug) => {
    const interests = student.interestIDs;
    let choices = [];
    if (slug.endsWith('3xx')) {
      if (interests) {
        _.map(interests, function findInteresting(interestID) {
          choices = _.concat(choices, courseUtils.get300LevelChoices(interestID));
        });
        console.log(choices);
      }
    } else
      if (slug.endsWith('4xx')) {
        if (interests) {
          _.map(interests, function findInteresting(interestID) {
            choices = _.concat(choices, courseUtils.get400LevelChoices(interestID, studentID));
          });
          console.log(choices);
        }
      } else {
        // console.log(typeof slug);
        const courseID = Courses.getID(slug);
        const course = Courses.findDoc(courseID);
        if (_.indexOf(courseTakenIDs, course._id) === -1) {
          plan[semStr].push(course.shortName);
          courseTakenIDs.push(course._id);
        }
      }
  });
  // year 4
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay4.fallSem;
  const interests = student.interestIDs;
  let choices = [];
  _.map(semesterCourses, (slug) => {
    if (slug.endsWith('3xx')) {
      if (interests) {
        // _.map(interests, function findInteresting(interestID) {
        //   choices = _.concat(choices, courseUtils.get300LevelChoices(interestID));
        // });
        choices = courseUtils.getStudent300LevelChoices(studentID);
        console.log(choices);
      }
    } else
      if (slug.endsWith('4xx')) {
        if (interests) {
          _.map(interests, function findInteresting(interestID) {
            choices = _.concat(choices, courseUtils.get400LevelChoices(interestID, studentID));
          });
          console.log(choices);
        }
      } else {
        // console.log(typeof slug);
        const courseID = Courses.getID(slug);
        const course = Courses.findDoc(courseID);
        if (_.indexOf(courseTakenIDs, course._id) === -1) {
          plan[semStr].push(course.shortName);
          courseTakenIDs.push(course._id);
        }
      }
  });
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay4.springSem;
  _.map(semesterCourses, (slug) => {
    if (slug.endsWith('3xx')) {
      if (interests) {
        _.map(interests, function findInteresting(interestID) {
          choices = _.concat(choices, courseUtils.get300LevelChoices(interestID));
        });
        console.log(choices);
      }
    } else
      if (slug.endsWith('4xx')) {
        if (interests) {
          _.map(interests, function findInteresting(interestID) {
            choices = _.concat(choices, courseUtils.get400LevelChoices(interestID, studentID));
          });
          console.log(choices);
        }
      } else {
        // console.log(typeof slug);
        const courseID = Courses.getID(slug);
        const course = Courses.findDoc(courseID);
        if (_.indexOf(courseTakenIDs, course._id) === -1) {
          plan[semStr].push(course.shortName);
          courseTakenIDs.push(course._id);
        }
      }
  });
  return plan;
}
