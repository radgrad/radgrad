import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from '../year/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as semUtils from '../semester/SemesterUtilities';
import * as courseUtils from '../course/CourseUtilities';
import * as opportunityUtils from '../opportunity/OpportunityUtilities';
import { getPlanningICE } from '../ice/IceProcessor';
import { BS_CS_LIST, BA_ICS_LIST } from './degree-program';

const area = 'PlanGeneratorPrerequisites';

/**
 * Converts a course Slug into the capitalized note needed for CourseInstances.
 * @param slug the course Slug e.g. 'ics111'
 * @returns {string} The capitalized string used in CourseInstances e.g. 'ICS 111'.
 */
function createNote(slug) {
  return `${slug.substring(0, 3).toUpperCase()} ${slug.substr(3, 7)}`;
}

/**
 * Returns the student's starting semester.  The starting semester is found by looking at CourseInstances.
 * @param student The student.
 */
export function getStartingSemester(student) {
  const studentID = student._id;
  let firstSemester = null;
  const instances = CourseInstances.find({ studentID }).fetch();
  _.map(instances, (instance) => {
    const sem = Semesters.findDoc(instance.semesterID);
    if (!firstSemester) {
      firstSemester = sem;
    } else
      if (sem.sortBy < firstSemester.sortBy) {
        firstSemester = sem;
      }
  });
  return firstSemester;
}

function isCoreInstance(courseInstance) {
  const note = courseInstance.note;
  return (note === 'ICS 111' ||
  note === 'ICS 141' ||
  note === 'ICS 211' ||
  note === 'ICS 241' ||
  note === 'ICS 314' ||
  note === 'ICS 311');
}

function getPassedCourseInstances(student) {
  const studentID = student._id;
  const instances = CourseInstances.find({ studentID }).fetch();
  const passedInstances = [];
  _.map(instances, (instance) => {
    const instanceID = instance._id;
    if (CourseInstances.isICS(instanceID)) {
      if (isCoreInstance(instance)) {
        if (instance.grade.includes('A') || instance.grade.includes('B')) {
          passedInstances.push(instance);
        }
      } else
        if (instance.grade.includes('A') || instance.grade.includes('B') || instance.grade.includes('C')) {
          passedInstances.push(instance);
        }
    }
  });
  return passedInstances;
}

function getPassedCourseSlugs(student) {
  const ret = [];
  const passedInstances = getPassedCourseInstances(student);
  _.map(passedInstances, (instance) => {
    ret.push(CourseInstances.getCourseSlug(instance._id));
  });
  return ret;
}

function removeTakenCourses(student, degreeList) {
  const takenCourses = getPassedCourseInstances(student);
  _.map(takenCourses, (instance) => {
    const courseSlug = CourseInstances.getCourseSlug(instance._id);
    const index = _.indexOf(degreeList, courseSlug);
    if (index !== -1) {
      degreeList.splice(index, 1);
    } else {
      // console.log(`${student.username} took ${courseSlug}, but it isn't a required course`);
    }
  });
}

function hasPrerequisites(courseSlug, takenCourseSlugs) {
  const courseID = Courses.findIdBySlug(courseSlug);
  const course = Courses.findDoc(courseID);
  let retVal = true;
  _.map(course.prerequisites, (prereq) => {
    if (_.indexOf(takenCourseSlugs, prereq) === -1) {
      retVal = false;
    }
  });
  return retVal;
}

function chooseCourse(student, semester, degreeList, courseTakenSlugs) {
  const studentID = student._id;
  const grade = 'A';
  const courseSlug = degreeList.splice(0, 1)[0];
  if (typeof courseSlug === 'object') {
    const bestChoice = courseUtils.chooseBetween(courseSlug, studentID, courseTakenSlugs);
    // console.log('bestChoice', courseSlug, bestChoice);
    CourseInstances.define({
      semester: Semesters.getSlug(semester._id),
      course: Courses.getSlug(bestChoice._id),
      note: bestChoice.number,
      grade,
      student: student.username,
    });
  } else
    if (courseSlug.endsWith('3xx')) {
      const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID, courseTakenSlugs);
      // console.log('bestChoice', courseSlug, bestChoice);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        grade,
        student: student.username,
      });
    } else
      if (courseSlug.endsWith('4xx')) {
        const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID, courseTakenSlugs);
        // console.log('bestChoice', courseSlug, bestChoice);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          grade,
          student: student.username,
        });
      } else {
        const note = createNote(courseSlug);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: courseSlug,
          note,
          grade,
          student: student.username,
        });
      }
}

/**
 * Used to select 2 core courses. This only works for the up until ics321. No choices.
 * @param student
 * @param semester
 * @param degreeList
 */
function choose2Core(student, semester, degreeList) {
  const takenSlugs = getPassedCourseSlugs(student);
  const grade = 'A';
  let firstCourseSlug = degreeList.splice(0, 1)[0];
  let secondCourseSlug = degreeList.splice(0, 1)[0];
  if (hasPrerequisites(firstCourseSlug, takenSlugs)) {
    const note = createNote(firstCourseSlug);
    CourseInstances.define({
      semester: Semesters.getSlug(semester._id),
      course: firstCourseSlug,
      note,
      grade,
      student: student.username,
    });
  } else {
    degreeList.splice(1, 0, firstCourseSlug);
    firstCourseSlug = degreeList.splice(0, 1)[0];
    if (hasPrerequisites(firstCourseSlug, takenSlugs)) {
      const note = createNote(firstCourseSlug);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: firstCourseSlug,
        note,
        grade,
        student: student.username,
      });
    } else {
      degreeList.splice(1, 0, firstCourseSlug);
      firstCourseSlug = degreeList.splice(0, 1)[0];
      if (hasPrerequisites(firstCourseSlug, takenSlugs)) {
        const note = createNote(firstCourseSlug);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: firstCourseSlug,
          note,
          grade,
          student: student.username,
        });
      }  // give up
    }
  }
  if (hasPrerequisites(secondCourseSlug, takenSlugs)) {
    const note = createNote(secondCourseSlug);
    CourseInstances.define({
      semester: Semesters.getSlug(semester._id),
      course: secondCourseSlug,
      note,
      grade,
      student: student.username,
    });
  } else {
    degreeList.splice(1, 0, secondCourseSlug);
    secondCourseSlug = degreeList.splice(0, 1)[0];
    if (hasPrerequisites(secondCourseSlug, takenSlugs)) {
      const note = createNote(secondCourseSlug);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: secondCourseSlug,
        note,
        grade,
        student: student.username,
      });
    } else {
      degreeList.splice(1, 0, secondCourseSlug);
    }
  } // give up here?
}

export function generateBSDegreePlan(student, startSemester) {
  // Get the correct list of courses needed for the plan.
  const degreeList = BS_CS_LIST.slice(0);
  // remove the courses that the student has already taken.
  removeTakenCourses(student, degreeList);
  let semester = startSemester;
  let ice;
  const chosenOpportunites = [];
  let oppDefn;

  // Define the First Academic Year
  if (semester.term === Semesters.SPRING) {
    AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let i = 0;
  while (degreeList.length > 9) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      choose2Core(student, semester, degreeList);
    }
    // Define the opportunity instance for the semester
    // Choose an opportunity.
    const semesterOpportunity = opportunityUtils.chooseStudentSemesterOpportunity(semester, i, student._id);
    if (semesterOpportunity) {
      ice = getPlanningICE(chosenOpportunites);
      chosenOpportunites.push(semesterOpportunity);
      if (ice.i < 100 || ice.e < 100) {
        oppDefn = {
          semester: Semesters.getSlug(semester._id),
          opportunity: Opportunities.getSlug(semesterOpportunity._id),
          verified: false,
          student: student.username,
        };
        OpportunityInstances.define(oppDefn);
      }
    }
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
  while (degreeList.length > 0) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      const coursesTaken = getPassedCourseSlugs(student);
      chooseCourse(student, semester, degreeList, coursesTaken);
      if (degreeList.length > 0) {
        chooseCourse(student, semester, degreeList, coursesTaken);
      }
    }
    // Define the opportunity instance for the semester
    // Choose an opportunity.
    const semesterOpportunity = opportunityUtils.chooseStudentSemesterOpportunity(semester, i, student._id);
    if (semesterOpportunity) {
      ice = getPlanningICE(chosenOpportunites);
      chosenOpportunites.push(semesterOpportunity);
      if (ice.i < 100 || ice.e < 100) {
        oppDefn = {
          semester: Semesters.getSlug(semester._id),
          opportunity: Opportunities.getSlug(semesterOpportunity._id),
          verified: false,
          student: student.username,
        };
        OpportunityInstances.define(oppDefn);
      }
    }
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
}

export function generateBADegreePlan(student, startSemester) {
  // get the right course list.
  const degreeList = BA_ICS_LIST.slice(0);
  // remove the courses that the student has already taken.
  removeTakenCourses(student, degreeList);
  let semester = startSemester;
  let ice;
  const chosenOpportunites = [];
  let oppDefn;

  // Define the First Academic Year
  if (semester.term === Semesters.SPRING) {
    AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let i = 0;
  while (degreeList.length > 4) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      choose2Core(student, semester, degreeList);
    }
    // Define the opportunity instance for the semester
    // Choose an opportunity.
    const semesterOpportunity = opportunityUtils.chooseStudentSemesterOpportunity(semester, i, student._id);
    if (semesterOpportunity) {
      ice = getPlanningICE(chosenOpportunites);
      chosenOpportunites.push(semesterOpportunity);
      if (ice.i < 100 || ice.e < 100) {
        oppDefn = {
          semester: Semesters.getSlug(semester._id),
          opportunity: Opportunities.getSlug(semesterOpportunity._id),
          verified: false,
          student: student.username,
        };
        OpportunityInstances.define(oppDefn);
      }
    }
    // update the semester
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
  while (degreeList.length > 0) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      const coursesTaken = getPassedCourseSlugs(student);
      chooseCourse(student, semester, degreeList, coursesTaken);
    }
    // Define the opportunity instance for the semester
    // Choose an opportunity.
    const semesterOpportunity = opportunityUtils.chooseStudentSemesterOpportunity(semester, i, student._id);
    if (semesterOpportunity) {
      ice = getPlanningICE(chosenOpportunites);
      chosenOpportunites.push(semesterOpportunity);
      if (ice.i < 100 || ice.e < 100) {
        oppDefn = {
          semester: Semesters.getSlug(semester._id),
          opportunity: Opportunities.getSlug(semesterOpportunity._id),
          verified: false,
          student: student.username,
        };
        OpportunityInstances.define(oppDefn);
      }
    }
    // update the semester
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
}

export function generateDegreePlan(template, startSemester, student) {
  const plan = {};
  const studentID = student._id;
  const instances = CourseInstances.find({ studentID }).fetch();
  const grade = 'A';
  const courseTakenIDs = [];
  const coursesTakenSlugs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') {
        courseTakenIDs.push(courseInstance.courseID);
        coursesTakenSlugs.push(Courses.getSlug(courseInstance.courseID));
      }
    }
  });
  let ice;
  const chosenOpportunites = [];
  // year 1
  let semester = startSemester;
  // Define the Academic Year(s)
  if (semester.term === Semesters.SPRING) {
    AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let semesterCourses;
  let semesterOpportunity;
  let oppDefn;
  for (let i = 0; i < 12; i += 1) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (startSemester.term === Semesters.FALL) {
      // Define the course instances for the semester
      switch (i) {
        case 0:
          semesterCourses = template.ay1.fallSem;
          break;
        case 1:
          semesterCourses = template.ay1.springSem;
          break;
        case 3:
          semesterCourses = template.ay2.fallSem;
          break;
        case 4:
          semesterCourses = template.ay2.springSem;
          break;
        case 6:
          semesterCourses = template.ay3.fallSem;
          break;
        case 7:
          semesterCourses = template.ay3.springSem;
          break;
        case 9:
          semesterCourses = template.ay4.fallSem;
          break;
        case 10:
          semesterCourses = template.ay4.springSem;
          break;
        default:
          semesterCourses = [];
      }
    } else {
      switch (i) {
        case 0:
          semesterCourses = template.ay1.fallSem;
          break;
        case 2:
          semesterCourses = template.ay1.springSem;
          break;
        case 3:
          semesterCourses = template.ay2.fallSem;
          break;
        case 5:
          semesterCourses = template.ay2.springSem;
          break;
        case 6:
          semesterCourses = template.ay3.fallSem;
          break;
        case 8:
          semesterCourses = template.ay3.springSem;
          break;
        case 9:
          semesterCourses = template.ay4.fallSem;
          break;
        case 11:
          semesterCourses = template.ay4.springSem;
          break;
        default:
          semesterCourses = [];
      }
    }
    _.map(semesterCourses, (slug) => { // eslint-disable-line no-loop-func
      if (typeof slug === 'object') {
        const bestChoice = courseUtils.chooseBetween(slug, studentID, coursesTakenSlugs);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          grade,
          student: student.username,
        });
        courseTakenIDs.push(bestChoice._id);
        coursesTakenSlugs.push(Courses.getSlug(bestChoice._id));
      } else
        if (slug.endsWith('3xx')) {
          const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID, coursesTakenSlugs);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: Courses.getSlug(bestChoice._id),
            note: bestChoice.number,
            grade,
            student: student.username,
          });
          courseTakenIDs.push(bestChoice._id);
          coursesTakenSlugs.push(Courses.getSlug(bestChoice._id));
        } else
          if (slug.endsWith('4xx')) {
            const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID, coursesTakenSlugs);
            CourseInstances.define({
              semester: Semesters.getSlug(semester._id),
              course: Courses.getSlug(bestChoice._id),
              note: bestChoice.number,
              grade,
              student: student.username,
            });
            courseTakenIDs.push(bestChoice._id);
            coursesTakenSlugs.push(Courses.getSlug(bestChoice._id));
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
                grade,
                student: student.username,
              });
              courseTakenIDs.push(course._id);
              coursesTakenSlugs.push(Courses.getSlug(course._id));
            }
          }
    });
    // Define the opportunity instance for the semester
    // Choose an opportunity.
    semesterOpportunity = opportunityUtils.chooseStudentSemesterOpportunity(semester, student._id);
    if (semesterOpportunity) {
      ice = getPlanningICE(chosenOpportunites);
      chosenOpportunites.push(semesterOpportunity);
      if (ice.i < 100 || ice.e < 100) {
        oppDefn = {
          semester: Semesters.getSlug(semester._id),
          opportunity: Opportunities.getSlug(semesterOpportunity._id),
          verified: false,
          student: student.username,
        };
        OpportunityInstances.define(oppDefn);
      }
    }
    // update the semester
    semester = semUtils.nextSemester(semester);
  }
  courseUtils.checkPrerequisites(studentID, area);
  return plan;
}
