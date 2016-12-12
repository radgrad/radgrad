import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Semesters } from '../semester/SemesterCollection';
import * as semUtils from '../semester/SemesterUtilities';
import * as courseUtils from '../course/CourseFunctions';
import * as opportunityUtils from '../opportunity/OpportunityFunctions';
import { getPlanningICE } from '../ice/IceProcessor';

const area = 'PlanGeneratorPrerequisites';

function createNote(slug) {
  return `${slug.substring(0, 3).toUpperCase()} ${slug.substr(3, 7)}`;
}
export function generateDegreePlan(template, startSemester, student) {
  const plan = {};
  const studentID = student._id;
  const instances = CourseInstances.find({ studentID }).fetch();
  const grade = 'A';
  const courseTakenIDs = [];
  instances.forEach((courseInstance) => {
    if (CourseInstances.isICS(courseInstance._id)) {
      if (courseInstance.note !== 'ICS 499') {
        courseTakenIDs.push(courseInstance.courseID);
      }
    }
  });
  let ice;
  const chosenOpportunites = [];
  // year 1
  let semester = startSemester;
  // Define the Academic Year(s)
  if (semester.term === Semesters.SPRING) {
    Meteor.call('Collection.define', {
      collectionName: 'AcademicYearInstances',
      doc: { year: semester.year - 1, student: student.username },
    });
  }
  let semesterCourses;
  let semesterOpportunity;
  let oppDefn;
  for (let i = 0; i < 12; i += 1) {
    if (i % 3 === 0) {
      Meteor.call('Collection.define', {
        collectionName: 'AcademicYearInstances',
        doc: { year: semester.year, student: student.username },
      });
      // AcademicYearInstances.define({ year: semester.year, student: student.username });
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
        const bestChoice = courseUtils.chooseBetween(slug, studentID);
        Meteor.call('Collection.define', {
          collectionName: 'CourseInstances',
          doc: {
            semester: Semesters.getSlug(semester._id),
            course: Courses.getSlug(bestChoice._id),
            note: bestChoice.number,
            verified: false,
            grade,
            student: student.username,
          },
        });
        courseTakenIDs.push(bestChoice._id);
      } else
        if (slug.endsWith('3xx')) {
          const bestChoice = courseUtils.chooseStudent300LevelCourse(studentID);
          Meteor.call('Collection.define', {
            collectionName: 'CourseInstances',
            doc: {
              semester: Semesters.getSlug(semester._id),
              course: Courses.getSlug(bestChoice._id),
              note: bestChoice.number,
              verified: false,
              grade,
              student: student.username,
            },
          });
        } else
          if (slug.endsWith('4xx')) {
            const bestChoice = courseUtils.chooseStudent400LevelCourse(studentID);
            Meteor.call('Collection.define', {
              collectionName: 'CourseInstances',
              doc: {
                semester: Semesters.getSlug(semester._id),
                course: Courses.getSlug(bestChoice._id),
                note: bestChoice.number,
                verified: false,
                grade,
                student: student.username,
              },
            });
          } else {
            // console.log(typeof slug);
            const courseID = Courses.getID(slug);
            const course = Courses.findDoc(courseID);
            if (_.indexOf(courseTakenIDs, course._id) === -1) {
              const note = createNote(slug);
              Meteor.call('Collection.define', {
                collectionName: 'CourseInstances',
                doc: {
                  semester: Semesters.getSlug(semester._id),
                  course: slug,
                  note,
                  verified: false,
                  grade,
                  student: student.username,
                },
              });
              courseTakenIDs.push(course._id);
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
        Meteor.call('Collection.define', {
          collectionName: 'OpportunityInstances',
          doc: oppDefn,
        });
      }
    }
    // update the semester
    semester = semUtils.nextSemester(semester);
  }
  courseUtils.checkPrerequisites(studentID, area);
  return plan;
}
