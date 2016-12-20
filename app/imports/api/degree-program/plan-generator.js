import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicYearInstances } from '../year/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as semUtils from '../semester/SemesterUtilities';
import * as courseUtils from '../course/CourseFunctions';
import * as opportunityUtils from '../opportunity/OpportunityFunctions';
import { getPlanningICE } from '../ice/IceProcessor';
import { BS_CS_LIST, BA_ICS_LIST } from './degree-program';

const area = 'PlanGeneratorPrerequisites';
const TAKEN = 1;
const FAILED = 2;
const CHOOSEN = 3;

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

function getPastCourses(student, semester) {
  // console.log('coursesPassed', student);
  const studentID = student._id;
  const semesterID = semester._id;
  const instances = CourseInstances.find({ studentID }).fetch();
  const coursesPassed = [];
  const courseInstancesPassed = [];
  const coursesFailed = [];
  _.map(instances, (instance) => {
    const instanceID = instance._id;
    if (CourseInstances.isICS(instanceID)) {
      const courseSlug = Courses.getSlug(instance.courseID);
      if (isCoreInstance(instance)) {
        if (instance.grade.includes('A') || instance.grade.includes('B')) {
          coursesPassed.push(courseSlug);
          courseInstancesPassed.push(instance);
        } else
          if (instance.semesterID === semesterID) {
            coursesFailed.push(courseSlug);
          }
      } else
        if (instance.grade.includes('A') || instance.grade.includes('B') || instance.grade.includes('C')) {
          coursesPassed.push(courseSlug);
          courseInstancesPassed.push(instance);
        } else
          if (instance.semesterID === semesterID) {
            coursesFailed.push(courseSlug);
          }
    }
  });
  console.log('passed', coursesPassed, 'failed', coursesFailed);
  return {
    passed: coursesPassed,
    passedInstances: courseInstancesPassed,
    failed: coursesFailed,
  };
}

function chooseCourseSemester(student, semester, degreeList) {
  // console.log('chooseCourseSemester', student, semester, degreeList);
  const studentID = student._id;
  const grade = 'A';
  const pastCourses = getPastCourses(student, semester);
  const coursesPassed = pastCourses.passed;
  const courseInstancesPassed = pastCourses.passedInstances;
  const coursesFailed = pastCourses.failed;
  console.log('degreeList', degreeList);
  const courseSlug = degreeList[0];
  if (typeof courseSlug === 'object') {
    const bestChoice = courseUtils.chooseBetween(courseSlug, studentID, coursesPassed, courseInstancesPassed);
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
      const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID, coursesPassed, courseInstancesPassed);
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
        const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID, coursesPassed, courseInstancesPassed);
        // console.log('bestChoice', courseSlug, bestChoice);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          grade,
          student: student.username,
        });
      } else
        if (_.indexOf(coursesPassed, courseSlug) === -1 && _.indexOf(coursesFailed, courseSlug) === -1) {
          const note = createNote(courseSlug);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: courseSlug,
            note,
            grade,
            student: student.username,
          });
        } else
          if (_.indexOf(coursesPassed, courseSlug) === -1) {
            return FAILED;
          } else
            if (_.indexOf(coursesFailed, courseSlug) === -1) {
              return TAKEN;
            }
  return CHOOSEN;
}

export function generateBSDegreePlan(student, startSemester) {
  const degreeList = BS_CS_LIST;
  let semester = startSemester;
  let ice;
  const chosenOpportunites = [];
  let oppDefn;

  // Define the First Academic Year
  if (semester.term === Semesters.SPRING) {
    // AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let i = 0;
  while (degreeList.length > 0) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      if (chooseCourseSemester(student, semester, degreeList) !== FAILED) {
        degreeList.splice(0, 1);
      } else {
        const val = degreeList.splice(0, 1)[0];
        degreeList.splice(1, 0, val);
        console.log('degreeList', degreeList);
      }
      if (degreeList.length > 0) {
        if (chooseCourseSemester(student, semester, degreeList) !== FAILED) {
          degreeList.splice(0, 1);
        } else {
          const val = degreeList.splice(0, 1)[0];
          degreeList.splice(1, 0, val);
          console.log('degreeList', degreeList);
        }
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
    // update the semester
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
}

export function generateBADegreePlan(student, startSemester) {
  const degreeList = BA_ICS_LIST;
  let semester = startSemester;
  let ice;
  const chosenOpportunites = [];
  let oppDefn;

  // Define the First Academic Year
  if (semester.term === Semesters.SPRING) {
    // AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let i = 0;
  while (degreeList.length > 0) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      if (chooseCourseSemester(student, semester, degreeList) !== FAILED) {
        degreeList.splice(0, 1);
      } else {
        const val = degreeList.splice(0, 1)[0];
        degreeList.splice(1, 0, val);
        console.log('degreeList', degreeList);
      }
      if (i < 6) {
        if (chooseCourseSemester(student, semester, degreeList) !== FAILED) {
          degreeList.splice(0, 1);
        } else {
          const val = degreeList.splice(0, 1)[0];
          degreeList.splice(1, 0, val);
          console.log('degreeList', degreeList);
        }
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
    // update the semester
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
}

export function generateDegreePlan(template, startSemester, student) {
  console.log('generateDegreePlan', template, startSemester, student);
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
