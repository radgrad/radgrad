import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from '../year/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as semUtils from '../semester/SemesterUtilities';
import * as courseUtils from '../course/CourseFunctions';

const area = 'PlanGeneratorPrerequisites';

function createNote(slug) {
  return `${slug.substring(0, 3).toUpperCase()} ${slug.substr(3, 7)}`;
}

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
  if (semester.term === Semesters.SPRING) {
    AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  AcademicYearInstances.define({ year: semester.year, student: student.username });
  let semesterCourses = template.ay1.fallSem;
  let semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  _.map(semesterCourses, (slug) => {
    const courseID = Courses.getID(slug);
    const course = Courses.findDoc(courseID);
    if (_.indexOf(courseTakenIDs, course._id) === -1) {
      const note = createNote(slug);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: slug,
        note,
        student: student.username,
      });
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
      const note = createNote(slug);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: slug,
        note,
        student: student.username,
      });
      plan[semStr].push(course.shortName);
      courseTakenIDs.push(course._id);
    }
  });
  // year 2
  semester = semUtils.nextFallSpringSemester(semester);
  AcademicYearInstances.define({ year: semester.year, student: student.username });
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay2.fallSem;
  _.map(semesterCourses, (slug) => {
    if (typeof slug === 'object') {
      const bestChoice = courseUtils.chooseBetween(slug, studentID);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        student: student.username,
      });
      plan[semStr].push(bestChoice.shortName);
      courseTakenIDs.push(bestChoice._id);
    } else {
      const courseID = Courses.getID(slug);
      const course = Courses.findDoc(courseID);
      if (_.indexOf(courseTakenIDs, course._id) === -1) {
        const note = createNote(slug);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: slug,
          note,
          student: student.username,
        });
        plan[semStr].push(course.shortName);
        courseTakenIDs.push(course._id);
      }
    }
  });
  semester = semUtils.nextFallSpringSemester(semester);
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay2.springSem;
  _.map(semesterCourses, (slug) => {
    if (typeof slug === 'object') {
      const bestChoice = courseUtils.chooseBetween(slug, studentID);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        student: student.username,
      });
      plan[semStr].push(bestChoice.shortName);
      courseTakenIDs.push(bestChoice._id);
    } else {
      const courseID = Courses.getID(slug);
      const course = Courses.findDoc(courseID);
      if (_.indexOf(courseTakenIDs, course._id) === -1) {
        const note = createNote(slug);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: slug,
          note,
          student: student.username,
        });
        plan[semStr].push(course.shortName);
        courseTakenIDs.push(course._id);
      }
    }
  });
  // year 3
  semester = semUtils.nextFallSpringSemester(semester);
  AcademicYearInstances.define({ year: semester.year, student: student.username });
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay3.fallSem;
  _.map(semesterCourses, (slug) => {
    if (typeof slug === 'object') {
      const bestChoice = courseUtils.chooseBetween(slug, studentID);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        student: student.username,
      });
      plan[semStr].push(bestChoice.shortName);
      courseTakenIDs.push(bestChoice._id);
    } else
      if (slug.endsWith('3xx')) {
        const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          student: student.username,
        });
      } else
        if (slug.endsWith('4xx')) {
          const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: Courses.getSlug(bestChoice._id),
            note: bestChoice.number,
            student: student.username,
          });
        } else {
          // console.log(typeof slug);
          const courseID = Courses.getID(slug);
          const course = Courses.findDoc(courseID);
          if (_.indexOf(courseTakenIDs, course._id) === -1) {
            const note = createNote(slug);
            CourseInstances.define({
              semester: Semesters.getSlug(semester._id),
              course: slug,
              note,
              student: student.username,
            });
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
    if (typeof slug === 'object') {
      const bestChoice = courseUtils.chooseBetween(slug, studentID);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        student: student.username,
      });
      plan[semStr].push(bestChoice.shortName);
      courseTakenIDs.push(bestChoice._id);
    } else
      if (slug.endsWith('3xx')) {
        const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          student: student.username,
        });
      } else
        if (slug.endsWith('4xx')) {
          const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: Courses.getSlug(bestChoice._id),
            note: bestChoice.number,
            student: student.username,
          });
        } else {
          // console.log(typeof slug);
          const courseID = Courses.getID(slug);
          const course = Courses.findDoc(courseID);
          if (_.indexOf(courseTakenIDs, course._id) === -1) {
            const note = createNote(slug);
            CourseInstances.define({
              semester: Semesters.getSlug(semester._id),
              course: slug,
              note,
              student: student.username,
            });
            plan[semStr].push(course.shortName);
            courseTakenIDs.push(course._id);
          }
        }
  });
// year 4
  semester = semUtils.nextFallSpringSemester(semester);
  AcademicYearInstances.define({ year: semester.year, student: student.username });
  semStr = Semesters.toString(semester._id, true);
  plan[semStr] = [];
  semesterCourses = template.ay4.fallSem;
  _.map(semesterCourses, (slug) => {
    if (typeof slug === 'object') {
      const bestChoice = courseUtils.chooseBetween(slug, studentID);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        student: student.username,
      });
      plan[semStr].push(bestChoice.shortName);
      courseTakenIDs.push(bestChoice._id);
    } else
      if (slug.endsWith('3xx')) {
        const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          student: student.username,
        });
      } else
        if (slug.endsWith('4xx')) {
          const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: Courses.getSlug(bestChoice._id),
            note: bestChoice.number,
            student: student.username,
          });
        } else {
          // console.log(typeof slug);
          const courseID = Courses.getID(slug);
          const course = Courses.findDoc(courseID);
          if (_.indexOf(courseTakenIDs, course._id) === -1) {
            const note = createNote(slug);
            CourseInstances.define({
              semester: Semesters.getSlug(semester._id),
              course: slug,
              note,
              student: student.username,
            });
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
    if (typeof slug === 'object') {
      const bestChoice = courseUtils.chooseBetween(slug, studentID);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        student: student.username,
      });
      plan[semStr].push(bestChoice.shortName);
      courseTakenIDs.push(bestChoice._id);
    } else
      if (slug.endsWith('3xx')) {
        const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          student: student.username,
        });
      } else
        if (slug.endsWith('4xx')) {
          const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: Courses.getSlug(bestChoice._id),
            note: bestChoice.number,
            student: student.username,
          });
        } else {
          // console.log(typeof slug);
          const courseID = Courses.getID(slug);
          const course = Courses.findDoc(courseID);
          if (_.indexOf(courseTakenIDs, course._id) === -1) {
            const note = createNote(slug);
            CourseInstances.define({
              semester: Semesters.getSlug(semester._id),
              course: slug,
              note,
              student: student.username,
            });
            plan[semStr].push(course.shortName);
            courseTakenIDs.push(course._id);
          }
        }
  });
  courseUtils.checkPrerequisites(studentID, area);
  return plan;
}
