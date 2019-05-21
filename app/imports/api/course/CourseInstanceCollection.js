import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { Courses } from '../course/CourseCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { ROLE } from '../role/Role';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';
import { Slugs } from '../slug/SlugCollection';
import BaseCollection from '../base/BaseCollection';
import { makeCourseICE } from '../ice/IceProcessor';
import { StudentProfiles } from '../user/StudentProfileCollection';


/**
 * Represents the taking of a course by a specific student in a specific semester.
 * @memberOf api/course
 * @extends api/base.BaseCollection
 */
class CourseInstanceCollection extends BaseCollection {
  /**
   * Creates the CourseInstance collection.
   */
  constructor() {
    super('CourseInstance', new SimpleSchema({
      semesterID: SimpleSchema.RegEx.Id,
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      verified: Boolean,
      fromSTAR: { type: Boolean, optional: true },
      grade: { type: String, optional: true },
      creditHrs: Number,
      note: { type: String, optional: true },
      studentID: SimpleSchema.RegEx.Id,
      ice: { type: Object, optional: true, blackbox: true },
      retired: { type: Boolean, optional: true },
    }));
    this.validGrades = ['', 'A', 'A+', 'A-',
      'B', 'B+', 'B-', 'C', 'C+', 'C-', 'D', 'D+', 'D-', 'F', 'CR', 'NC', '***', 'W', 'TBD', 'OTHER'];
    this.publicationNames = {
      student: this._collectionName,
      perStudentAndSemester: `${this._collectionName}.PerStudentAndSemester`,
      publicStudent: `${this._collectionName}.PublicStudent`,
      publicSlugStudent: `${this._collectionName}.PublicSlugStudent`,
      studentID: `${this._collectionName}.studentID`,
    };
    if (Meteor.server) {
      this._collection._ensureIndex({ _id: 1, studentID: 1, courseID: 1 });
    }
  }

  /**
   * Defines a new CourseInstance.
   * @example
   * // To define an instance of a CS course:
   * CourseInstances.define({ semester: 'Spring-2016',
   *                          course: 'ics311',
   *                          verified: false,
   *                          fromSTAR: false,
   *                          grade: 'B',
   *                          note: '',
   *                          student: 'joesmith@hawaii.edu',
   *                          creditHrs: 3 });
   * @param { Object } description Object with keys semester, course, verified, fromSTAR, grade,
   * note, student, creditHrs.
   * Required fields: semester, student, course, which must all be valid slugs or instance IDs.
   * If the course slug is 'other', then the note field will be used as the course number.
   * Optional fields: note (defaults to ''), valid (defaults to false), grade (defaults to '').
   * CreditHrs defaults to the creditHrs assigned to course, or can be provided explicitly.
   * @throws {Meteor.Error} If the definition includes an undefined course or student.
   * @returns The newly created docID.
   */
  define({ semester, course, verified = false, fromSTAR = false, grade = '', note = '', student, creditHrs, retired }) {
    // Check arguments
    const semesterID = Semesters.getID(semester);
    const semesterDoc = Semesters.findDoc(semesterID);
    const courseID = Courses.getID(course);
    const studentID = Users.getID(student);
    const profile = Users.getProfile(studentID);
    // console.log('CourseInstanceDefine profile=%o', profile);
    // ensure the AcademicYearInstance is defined.
    if (semesterDoc.term === Semesters.SPRING || semesterDoc.term === Semesters.SUMMER) {
      AcademicYearInstances.define({ year: semesterDoc.year - 1, student: profile.username });
    } else {
      AcademicYearInstances.define({ year: semesterDoc.year, student: profile.username });
    }
    const ice = makeCourseICE(course, grade);
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`, '', Error().stack);
    }
    if (!_.includes(this.validGrades, grade)) {
      if (grade.startsWith('I')) {
        grade = grade.substring(1);
      }
      if (!_.includes(this.validGrades, grade)) {
        throw new Meteor.Error(`${grade} is not a valid grade.`, '', Error().stack);
      }
    }
    /* eslint no-param-reassign: "off" */
    if (!creditHrs) {
      creditHrs = Courses.findDoc(courseID).creditHrs;
    }
    // Define and return the CourseInstance
    // eslint-disable-next-line max-len
    return this._collection.insert({
      semesterID,
      courseID,
      verified,
      fromSTAR,
      grade,
      studentID,
      creditHrs,
      note,
      ice,
      retired,
    });
  }

  /**
   * Update the course instance. Only a subset of fields can be updated.
   * @param docID The course instance docID (required).
   * @param semesterID the semesterID for the course instance optional.
   * @param verified boolean optional.
   * @param fromSTAR boolean optional.
   * @param grade optional.
   * @param creditHrs optional.
   * @param note optional.
   * @param ice an object with fields i, c, e (optional)
   */
  update(docID, { semesterID, verified, fromSTAR, grade, creditHrs, note, ice, retired }) {
    // console.log('CourseInstances.update', semesterID, verified, fromSTAR, grade, creditHrs, note, ice);
    this.assertDefined(docID);
    const updateData = {};
    if (semesterID) {
      updateData.semesterID = semesterID;
    }
    if (_.isBoolean(verified)) {
      updateData.verified = verified;
    }
    if (_.isBoolean(fromSTAR)) {
      updateData.fromSTAR = fromSTAR;
    }
    if (grade) {
      updateData.grade = grade;
      const ci = this.findDoc(docID);
      const slug = Courses.findSlugByID(ci.courseID);
      updateData.ice = makeCourseICE(slug, grade);
    }
    if (creditHrs) {
      updateData.creditHrs = creditHrs;
    }
    if (note) {
      updateData.note = note;
    }
    if (ice) {
      updateData.ice = ice;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the course instance.
   * @param docID The docID of the course instance.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Removes all CourseInstance documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this._collection.remove({ studentID });
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this._assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Returns the Course associated with the CourseInstance with the given instanceID.
   * @param instanceID The id of the CourseInstance.
   * @returns {Object} The associated Course.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getCourseDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Courses.findDoc(instance.courseID);
  }

  /**
   * Returns the Course slug for the instance's corresponding Course.
   * @param instanceID The CourseInstanceID.
   * @return {string} The course slug.
   */
  getCourseSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Courses.getSlug(instance.courseID);
  }

  /**
   * Returns the Semester associated with the CourseInstance with the given instanceID.
   * @param instanceID The id of the CourseInstance.
   * @returns {Object} The associated Semester.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getSemesterDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Semesters.findDoc(instance.semesterID);
  }

  /**
   * Returns the Student profile associated with the CourseInstance with the given instanceID.
   * @param instanceID The id of the CourseInstance.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this._collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID);
  }

  /**
   * @returns { String } The course name associated with courseInstanceID.
   * @param courseInstanceID The course instance ID.
   * @throws {Meteor.Error} If courseInstanceID is not a valid ID.
   */
  findCourseName(courseInstanceID) {
    this.assertDefined(courseInstanceID);
    const courseID = this.findDoc(courseInstanceID).courseID;
    return Courses.findDoc(courseID).name;
  }

  /**
   * Returns the courseInstance document associated with semester, course, and student.
   * @param semester The semester (slug or ID).
   * @param course The course (slug or ID).
   * @param student The student (slug or ID)
   * @returns { Object } Returns the document or null if not found.
   * @throws { Meteor.Error } If semester, course, or student does not exist.
   */
  findCourseInstanceDoc(semester, course, student) {
    const semesterID = Semesters.getID(semester);
    const studentID = Users.getID(student);
    const courseID = Courses.getID(course);
    return this._collection.findOne({ semesterID, studentID, courseID });
  }

  /**
   * Returns true if there exists a CourseInstance for the given semester, course, and student.
   * @param semester The semester (slug or ID).
   * @param course The course (slug or ID).
   * @param student The student (slug or ID).
   * @returns True if the course instance exists.
   * @throws { Meteor.Error } If semester, course, or student does not exist.
   */
  isCourseInstance(semester, course, student) {
    return !!this.findCourseInstanceDoc(semester, course, student);
  }

  /**
   * @returns { boolean } If the course is an interesting course associated with courseInstanceID.
   * @param courseInstanceID The course instance ID.
   * @throws {Meteor.Error} If courseInstanceID is not a valid ID.
   */
  isInteresting(courseInstanceID) {
    this.assertDefined(courseInstanceID);
    const instance = this.findDoc(courseInstanceID);
    return Courses.findDoc(instance.courseID).number !== Courses.unInterestingSlug;
  }

  /**
   * Depending on the logged in user publish only their CourseInstances. If
   * the user is in the Role.ADMIN then publish all CourseInstances.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this.publicationNames.student, function publish() {
        if (!this.userId) {  // https://github.com/meteor/meteor/issues/9619
          return this.ready();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID: this.userId });
      });
      Meteor.publish(this.publicationNames.perStudentAndSemester,
        function perStudentAndSemester(studentID, semesterID) {  // eslint-disable-line
          new SimpleSchema({
            studentID: { type: String },
            semesterID: { type: String },
          }).validate({ studentID, semesterID });
          return instance._collection.find({ studentID, semesterID });
        });
      Meteor.publish(this.publicationNames.publicStudent, function publicStudentPublish() {
        const userID = Meteor.userId();
        const willingToShare = [];
        const profiles = StudentProfiles.find().fetch();
        _.forEach(profiles, (p) => {
          if (p.shareCourses) {
            willingToShare.push(p.userID);
          }
        });
        // console.log(willingToShare);
        ReactiveAggregate(this, instance._collection, [
          { $match: { $expr: { $or: [
            { $in: ['$studentID', willingToShare] },
            { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]), true] }] } } },
          { $project: { studentID: 1, semesterID: 1, courseID: 1 } },
        ]);
        // return instance._collection.find({}, { fields: { studentID: 1, semesterID: 1, courseID: 1 } });
      });
      Meteor.publish(this.publicationNames.publicSlugStudent, function publicSlugPublish(courseSlug) {  // eslint-disable-line
        // check the courseID.
        const slug = Slugs.findDoc({ name: courseSlug });
        const course = Courses.findDoc({ slugID: slug._id });
        const courseID = course._id;
        new SimpleSchema({
          courseID: { type: String },
        }).validate({ courseID });

        return instance._collection.find({ courseID }, { fields: { studentID: 1, semesterID: 1, courseID: 1 } });
      });
      Meteor.publish(this.publicationNames.studentID, function filterStudentID(studentID) { // eslint-disable-line
        new SimpleSchema({
          studentID: { type: String },
        }).validate({ studentID });
        // console.log(Roles.userIsInRole(studentID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY]));
        if (Roles.userIsInRole(studentID, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
          return instance._collection.find();
        }
        return instance._collection.find({ studentID });
      });
    }
  }

  /**
   * @returns {String} A formatted string representing the course instance.
   * @param courseInstanceID The course instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  toString(courseInstanceID) {
    this.assertDefined(courseInstanceID);
    const courseInstanceDoc = this.findDoc(courseInstanceID);
    const courseName = this.findCourseName(courseInstanceID);
    const semester = Semesters.toString(courseInstanceDoc.semesterID);
    const grade = courseInstanceDoc.grade;
    return `[CI ${semester} ${courseName} ${grade}]`;
  }

  /**
   * Updates the CourseInstance's grade. This should be used for planning purposes.
   * @param courseInstanceID The course instance ID.
   * @param grade The new grade.
   * @throws {Meteor.Error} If courseInstanceID is not a valid ID.
   */
  updateGrade(courseInstanceID, grade) {
    this.assertDefined(courseInstanceID);
    const ice = makeCourseICE(courseInstanceID, grade);
    this._collection.update({ _id: courseInstanceID }, { $set: { grade, ice, verified: false } });
  }

  /**
   * Updates the CourseInstance's Semester.
   * @param courseInstanceID The course instance ID.
   * @param semesterID The semester id.
   * @throws {Meteor.Error} If courseInstanceID is not a valid ID.
   */
  updateSemester(courseInstanceID, semesterID) {
    this.assertDefined(courseInstanceID);
    Semesters.assertSemester(semesterID);
    this._collection.update({ _id: courseInstanceID }, { $set: { semesterID } });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks semesterID, courseID, and studentID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Semesters.isDefined(doc.semesterID)) {
          problems.push(`Bad semesterID: ${doc.semesterID}`);
        }
        if (!Courses.isDefined(doc.courseID)) {
          problems.push(`Bad courseID: ${doc.courseID}`);
        }
        if (!Users.isDefined(doc.studentID)) {
          problems.push(`Bad studentID: ${doc.studentID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the CourseInstance docID in a format acceptable to define().
   * @param docID The docID of a CourseInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const semester = Semesters.findSlugByID(doc.semesterID);
    const course = Courses.findSlugByID(doc.courseID);
    const note = doc.note;
    const verified = doc.verified;
    const creditHrs = doc.creditHrs;
    const grade = doc.grade;
    const fromSTAR = doc.fromSTAR;
    const student = Users.getProfile(doc.studentID).username;
    const retired = doc.retired;
    return { semester, course, note, verified, fromSTAR, creditHrs, grade, student, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/course
 */
export const CourseInstances = new CourseInstanceCollection();
