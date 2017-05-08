import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../degree/AcademicPlanCollection';
import { AcademicYearInstances } from '../year/AcademicYearInstanceCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import * as semUtils from '../semester/SemesterUtilities';
import * as courseUtils from '../course/CourseUtilities';
import * as planChoiceUtils from '../degree/PlanChoiceUtilities';
import { BS_CS_LIST, BA_ICS_LIST } from './degree-program';

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

/**
 * Returns true if the courseInstance is a core ICS course, 111, 141, 211, 241, 314, 311.
 * @param courseInstance the course instance.
 * @returns {boolean}
 */
function isCoreInstance(courseInstance) {
  const note = courseInstance.note;
  return (note === 'ICS 111' ||
  note === 'ICS 141' ||
  note === 'ICS 211' ||
  note === 'ICS 241' ||
  note === 'ICS 314' ||
  note === 'ICS 311');
}

function getPassedCourseInstances(student, department) {
  const studentID = student._id;
  const re = new RegExp(department);
  const instances = CourseInstances.find({ studentID, note: re }).fetch();
  // const currentSemester = Semesters.getCurrentSemesterDoc();
  const passedInstances = [];
  _.map(instances, (instance) => {
    // const instanceSemester = Semesters.findDoc(instance.semesterID);
    // const instanceID = instance._id;
    // if (CourseInstances.isICS(instanceID)) {
    if (isCoreInstance(instance)) {
      if (instance.grade.includes('A') || instance.grade.includes('B') || instance.grade.includes('CR')) {
        passedInstances.push(instance);
      }
    } else
      if (instance.grade.includes('A') || instance.grade.includes('B') || instance.grade.includes('C')) {
        passedInstances.push(instance);
      }
    // }
  });
  return passedInstances;
}

function getPassedCourseSlugs(student, department) {
  const ret = [];
  const passedInstances = getPassedCourseInstances(student, department);
  _.map(passedInstances, (instance) => {
    ret.push(CourseInstances.getCourseSlug(instance._id));
  });
  return ret;
}

function getPassedCourseIDs(student, department) {
  const ret = [];
  const passedInstances = getPassedCourseInstances(student, department);
  _.map(passedInstances, (instance) => {
    ret.push(instance.courseID);
  });
  return ret;
}

function _missingCourses(courseIDs, planChoiceList) {
  // console.log('_missingCourses', courseIDs, planChoiceList);
  const choices = planChoiceList.splice(0);
  _.map(courseIDs, (id) => {
    const course = Courses.findDoc(id);
    const slug = Slugs.getNameFromID(course.slugID);
    const index = _.indexOf(choices, slug);
    if (index !== -1) {
      choices.splice(index, 1);
    } else
      if (slug.startsWith('ics4') || slug.startsWith('other')) {
        if (_.indexOf(choices, 'ics400+') !== -1) {
          choices.splice(_.indexOf(choices, 'ics400+'), 1);
        }
      } else {
        let i = 0;
        _.map(choices, (c) => {
          if (Array.isArray(c)) {
            if (_.indexOf(c, slug) !== -1) {
              choices.splice(i, 1);
            }
          }
          i += 1;
        });
      }
  });
  // console.log('_missingCourses', choices);
  return choices;
}

function removeTakenCourses(student, planChoiceList, department) {
  const passedIDs = getPassedCourseIDs(student, department);
  const missing = _missingCourses(passedIDs, planChoiceList);
  return missing;
}

function hasPrerequisites(courseSlug, takenCourseSlugs) {
  // console.log('hasPre', courseSlug, takenCourseSlugs);
  if (typeof courseSlug !== 'object') {
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
  return false;
}

function chooseCourse(student, semester, planChoiceList, courseTakenSlugs) {
  const studentID = student._id;
  const grade = 'A';
  let planChoice = planChoiceList.splice(0, 1)[0];
  planChoice = planChoiceUtils.stripCounter(planChoice);
  if (planChoiceUtils.isSingleChoice(planChoice)) {
    // console.log('single choice', planChoice);
    if (planChoice.endsWith('300+')) {
      const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID, courseTakenSlugs);
      // console.log('bestChoice', planChoice, bestChoice.number, Semesters.toString(semester._id, false));
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: Courses.getSlug(bestChoice._id),
        note: bestChoice.number,
        grade,
        student: student.username,
      });
    } else
      if (planChoice.endsWith('400+')) {
        const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID, courseTakenSlugs);
        // console.log('bestChoice', planChoice, bestChoice.number, Semesters.toString(semester._id, false));
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: Courses.getSlug(bestChoice._id),
          note: bestChoice.number,
          grade,
          student: student.username,
        });
      } else
        if (hasPrerequisites(planChoice, courseTakenSlugs)) {
          // console.log('only choice', planChoice, Semesters.toString(semester._id, false));
          const note = createNote(planChoice);
          CourseInstances.define({
            semester: Semesters.getSlug(semester._id),
            course: planChoice,
            note,
            grade,
            student: student.username,
          });
        } else {
          planChoiceList.splice(1, 0, planChoice);  // return slug to list in the second spot
          planChoice = planChoiceList.splice(0, 1)[0];
          if (hasPrerequisites(planChoice, courseTakenSlugs)) {
            // console.log('2nd choice', planChoice, Semesters.toString(semester._id, false));
            const note = createNote(planChoice);
            CourseInstances.define({
              semester: Semesters.getSlug(semester._id),
              course: planChoice,
              note,
              grade,
              student: student.username,
            });
          } else { // do we try one more time?
            // console.log(planChoiceList);
          }
        }
  } else
    if (planChoiceUtils.isSimpleChoice(planChoice)) {
      const choice = courseUtils.chooseBetween(planChoice.split(','), studentID, courseTakenSlugs);
      const courseSlug = Slugs.findDoc(choice.slugID).name;
      const note = createNote(courseSlug);
      CourseInstances.define({
        semester: Semesters.getSlug(semester._id),
        course: courseSlug,
        note,
        grade,
        student: student.username,
      });
      // console.log('simple choice', planChoice, courseSlug);
    } else
      if (planChoiceUtils.isComplexChoice(planChoice)) {
        const slugs = planChoiceUtils.complexChoiceToArray(planChoice);
        const choice = courseUtils.chooseBetween(slugs, studentID, courseTakenSlugs);
        const courseSlug = Slugs.findDoc(choice.slugID).name;
        const note = createNote(courseSlug);
        CourseInstances.define({
          semester: Semesters.getSlug(semester._id),
          course: courseSlug,
          note,
          grade,
          student: student.username,
        });
        // console.log('complex choice', planChoice, courseSlug);
      }
}

/**
 * Adds ACM-Manoa and WetWare Wednesdays to the student's RadGradPlan for the given semester.
 * @param student
 * @param semester
 */
function addOpportunities(student, semester) {
  let oppDefn;
  oppDefn = {
    semester: Semesters.getSlug(semester._id),
    opportunity: 'acm-manoa',
    verified: false,
    student: student.username,
  };
  OpportunityInstances.define(oppDefn);
  oppDefn = {
    semester: Semesters.getSlug(semester._id),
    opportunity: 'wetware-wednesday',
    verified: false,
    student: student.username,
  };
  OpportunityInstances.define(oppDefn);
  const securityInterest = Interests.findDoc({ name: 'Security' });
  if (_.indexOf(student.interestIDs, securityInterest._id) !== -1) {
    oppDefn = {
      semester: Semesters.getSlug(semester._id),
      opportunity: 'greyhats',
      verified: false,
      student: student.username,
    };
    OpportunityInstances.define(oppDefn);
  }
}

export function generateBSDegreePlan(student, startSemester) {
  // Get the correct list of courses needed for the plan.
  let planChoiceList = BS_CS_LIST.slice(0);
  // remove the courses that the student has already taken.
  planChoiceList = removeTakenCourses(student, planChoiceList, 'ICS');
  // console.log('planChoiceList', planChoiceList);
  let semester = startSemester;
  // let ice;
  // const chosenOpportunites = [];

  // Define the First Academic Year
  if (semester.term === Semesters.SPRING) {
    AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let i = 0;
  while (planChoiceList.length > 9) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      // choose2Core(student, semester, planChoiceList);
      let coursesTaken = getPassedCourseSlugs(student, 'ICS');
      chooseCourse(student, semester, planChoiceList, coursesTaken);
      if (planChoiceList.length > 0) {
        coursesTaken = getPassedCourseSlugs(student, 'ICS');
        chooseCourse(student, semester, planChoiceList, coursesTaken);
      }
      // Define the opportunity instance for the semester
      addOpportunities(student, semester);
    }
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
  while (planChoiceList.length > 0) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      const coursesTaken = getPassedCourseSlugs(student, 'ICS');
      chooseCourse(student, semester, planChoiceList, coursesTaken);
      if (planChoiceList.length > 0) {
        chooseCourse(student, semester, planChoiceList, coursesTaken);
      }
      // Define the opportunity instance for the semester
      addOpportunities(student, semester);
    }
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
}

export function generateBADegreePlan(student, startSemester) {
  // console.log('generateBADegreePlan');
  // get the right course list.
  let degreeList = BA_ICS_LIST.slice(0);
  // remove the courses that the student has already taken.
  degreeList = removeTakenCourses(student, degreeList, 'ICS');
  // console.log(degreeList);
  let semester = startSemester;
  // Define the First Academic Year
  if (semester.term === Semesters.SPRING || semester.term === Semesters.SUMMER) {
    AcademicYearInstances.define({ year: semester.year - 1, student: student.username });
  }
  let i = 0;
  while (degreeList.length > 4) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      // choose2Core(student, semester, degreeList);
      let coursesTaken = getPassedCourseSlugs(student, 'ICS');
      chooseCourse(student, semester, degreeList, coursesTaken);
      if (degreeList.length > 0) {
        coursesTaken = getPassedCourseSlugs(student, 'ICS');
        chooseCourse(student, semester, degreeList, coursesTaken);
      }
      // Define the opportunity instance for the semester
      addOpportunities(student, semester);
    }
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
  while (degreeList.length > 0) {
    if (i % 3 === 0) {
      AcademicYearInstances.define({ year: semester.year, student: student.username });
    }
    if (semester.term !== Semesters.SUMMER) {
      const coursesTaken = getPassedCourseSlugs(student, 'ICS');
      chooseCourse(student, semester, degreeList, coursesTaken);
      // Define the opportunity instance for the semester
      addOpportunities(student, semester);
    }
    semester = semUtils.nextSemester(semester);
    i += 1;
  }
}

export function generateAcademicPlan(student, startSemester) {
  if (student.academicPlanID) {
    const academicPlan = AcademicPlans.findDoc(student.academicPlanID);
    // Get the correct list of courses needed for the plan.
    let planChoiceList = academicPlan.courseList.slice(0);
    const coursesPerSemesterList = academicPlan.coursesPerSemester.slice(0);
    // remove the courses that the student has already taken.
    planChoiceList = removeTakenCourses(student, planChoiceList, 'ICS');
    let semester = startSemester;
    let i = 0;
    while (planChoiceList.length > 0) {
      const numCourses = coursesPerSemesterList[i];
      for (let j = 0; j < numCourses; j += 1) {
        const coursesTaken = getPassedCourseSlugs(student, 'ICS');
        chooseCourse(student, semester, planChoiceList, coursesTaken);
      }
      semester = semUtils.nextSemester(semester);
      i += 1;
    }
    // console.log('planChoiceList', planChoiceList, startSemester);
  }
}
