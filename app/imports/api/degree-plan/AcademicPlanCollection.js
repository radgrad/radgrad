import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';

/**
 * AcademicPlans holds the different academic plans possible in this department.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/degree-plan
 */
class AcademicPlanCollection extends BaseSlugCollection {

  /**
   * Creates the AcademicPlan collection.
   */
  constructor() {
    super('AcademicPlan', new SimpleSchema({
      name: String,
      description: String,
      slugID: SimpleSchema.RegEx.Id,
      degreeID: SimpleSchema.RegEx.Id,
      effectiveSemesterID: SimpleSchema.RegEx.Id,
      semesterNumber: Number,
      year: Number,
      coursesPerSemester: { type: Array, minCount: 12, maxCount: 15 }, 'coursesPerSemester.$': Number,
      courseList: [String],
      retired: { type: Boolean, optional: true },
    }));
    if (Meteor.server) {
      this._collection._ensureIndex({ _id: 1, degreeID: 1, effectiveSemesterID: 1 });
    }
  }

  /**
   * Defines an AcademicPlan.
   * @example
   *     AcademicPlans.define({
   *                        slug: 'bs-cs-2016',
   *                        degreeSlug: 'bs-cs',
   *                        name: 'B.S. in Computer Science',
   *                        description: 'The BS in CS degree offers a solid foundation in computer science.',
   *                        semester: 'Spring-2016',
   *                        coursesPerSemester: [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0],
   *                        courseList: ['ics111-1', 'ics141-1, 'ics211-1', 'ics241-1', 'ics311-1', 'ics314-1',
   *                                     'ics212-1', 'ics321-1', 'ics313,ics361-1', 'ics312,ics331-1', 'ics332-1',
   *                                     'ics400+-1', 'ics400+-2', 'ics400+-3', 'ics400+-4', 'ics400+-5'] })
   * @param slug The slug for the academic plan.
   * @param degreeSlug The slug for the desired degree.
   * @param name The name of the academic plan.
   * @param description The description of the academic plan.
   * @param semester the slug for the semester.
   * @param coursesPerSemester an array of the number of courses to take in each semester.
   * @param courseList an array of PlanChoices. The choices for each course.
   * @param retired optional, defaults to false, allows for retiring an academic plan.
   * @returns {*}
   */
  define({ slug, degreeSlug, name, description, semester, coursesPerSemester, courseList, retired = false }) {
    const degreeID = Slugs.getEntityID(degreeSlug, 'DesiredDegree');
    const effectiveSemesterID = Semesters.getID(semester);
    const doc = this._collection.findOne({ degreeID, name, effectiveSemesterID });
    if (doc) {
      return doc._id;
    }
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    const semesterDoc = Semesters.findDoc(effectiveSemesterID);
    const semesterNumber = semesterDoc.semesterNumber;
    const year = semesterDoc.year;
    const planID = this._collection.insert({
      slugID, degreeID, name, description, effectiveSemesterID, semesterNumber, year, coursesPerSemester,
      courseList, retired,
    });
    // Connect the Slug to this AcademicPlan.
    Slugs.updateEntityID(slugID, planID);
    return planID;
  }

  /**
   * Updates the AcademicPlan, instance.
   * @param instance the docID or slug associated with this AcademicPlan.
   * @param degreeSlug the slug for the DesiredDegree that this plan satisfies.
   * @param name the name of this AcademicPlan.
   * @param semester the first semester this plan is effective.
   * @param coursesPerSemester an array of the number of courses per semester.
   * @param courseList an array of PlanChoices, the choices for each course.
   * @param retired a boolean true if the academic plan is retired.
   */
  update(instance, { degreeSlug, name, semester, coursesPerSemester, courseList, retired }) {
    const docID = this.getID(instance);
    const updateData = {};
    if (degreeSlug) {
      updateData.degreeID = DesiredDegrees.getID(degreeSlug);
    }
    if (name) {
      updateData.name = name;
    }
    if (semester) {
      updateData.effectiveSemesterID = Semesters.getID(semester);
    }
    if (coursesPerSemester) {
      if (!Array.isArray(coursesPerSemester)) {
        throw new Meteor.Error(`CoursesPerSemester ${coursesPerSemester} is not an Array.`);
      }
      _.forEach(coursesPerSemester, (cps) => {
        if (!_.isNumber(cps)) {
          throw new Meteor.Error(`CoursePerSemester ${cps} is not a Number.`);
        }
      });
      updateData.coursesPerSemester = coursesPerSemester;
    }
    if (courseList) {
      if (!Array.isArray(courseList)) {
        throw new Meteor.Error(`CourseList ${courseList} is not an Array.`);
      }
      _.forEach(courseList, (pc) => {
        if (!_.isString(pc)) {
          throw new Meteor.Error(`CourseList ${pc} is not a PlanChoice.`);
        }
      });
      updateData.courseList = courseList;
    }
    if (retired) {
      updateData.retired = retired;
    } else {
      updateData.retired = false;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the AcademicPlan.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If docID is not an AcademicPlan, or if this plan is referenced by a User.
   */
  removeIt(instance) {
    const academicPlanID = this.getID(instance);
    // Check that no student is using this AcademicPlan.
    const isReferenced = Users.someProfiles(profile => profile.academicPlanID === academicPlanID);
    if (isReferenced) {
      throw new Meteor.Error(`AcademicPlan ${instance} is referenced.`);
    }
    super.removeIt(academicPlanID);
  }

  /**
   * Returns an array of problems. Checks the semesterID and DesiredDegree ID.
   * @returns {Array} An array of problem messages.
   */
  checkIntegrity() { // eslint-disable-line class-methods-use-this
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!Semesters.isDefined(doc.effectiveSemesterID)) {
        problems.push(`Bad semesterID: ${doc.effectiveSemesterID}`);
      }
      if (!DesiredDegrees.isDefined(doc.degreeID)) {
        problems.push(`Bad desiredDegreeID: ${doc.degreeID}`);
      }
      let numCourses = 0;
      _.forEach(doc.coursesPerSemester, (n) => {
        numCourses += n;
      });
      if (doc.courseList.length !== numCourses) {
        problems.push(`Mismatch between courseList.length ${doc.courseList.length} and sum of coursesPerSemester ${numCourses}`); // eslint-disable-line
      }
    });
    return problems;
  }

  /**
   * Returns the AcademicPlans that are effective on or after semesterNumber for the given DesiredDegree.
   * @param degree the desired degree either a slug or id.
   * @param semesterNumber (optional) the semester number. if undefined returns the latest AcademicPlans.
   * @return {any}
   */
  getPlansForDegree(degree, semesterNumber) {
    const degreeID = DesiredDegrees.getID(degree);
    if (!semesterNumber) {
      return this._collection.find({ degreeID, semesterNumber: this.getLatestSemesterNumber() }).fetch();
    }
    return this._collection.find({ degreeID, semesterNumber: { $gte: semesterNumber } }).fetch();
  }

  /**
   * Returns an array of the latest AcademicPlans.
   * @return {array}
   */
  getLatestPlans() {
    const semesterNumber = this.getLatestSemesterNumber();
    return _.filter(this._collection.find({ semesterNumber }).fetch(), (ap) => !ap.retired);
  }

  /**
   * Returns the largest semester number.
   * @return {number}
   */
  getLatestSemesterNumber() {
    const plans = this._collection.find().fetch();
    let max = 0;
    _.forEach(plans, (p) => {
      if (max < p.semesterNumber) {
        max = p.semesterNumber;
      }
    });
    return max;
  }

  /**
   * Returns the plan name and year for the given plan id.
   * @param planID the id of the academic plan.
   * @return {string}
   */
  toFullString(planID) {
    const plan = this.findDoc(planID);
    const semester = Semesters.findDoc(plan.effectiveSemesterID);
    return `${plan.name} (${semester.year})`;
  }

  /**
   * Returns an object representing the AcademicPlan docID in a format acceptable to define().
   * @param docID The docID of a HelpMessage.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const slug = Slugs.getNameFromID(doc.slugID);
    const degree = DesiredDegrees.findDoc(doc.degreeID);
    const degreeSlug = Slugs.findDoc(degree.slugID).name;
    const name = doc.name;
    const description = doc.description;
    const semesterDoc = Semesters.findDoc(doc.effectiveSemesterID);
    const semester = Slugs.findDoc(semesterDoc.slugID).name;
    const coursesPerSemester = doc.coursesPerSemester;
    const courseList = doc.courseList;
    return { slug, degreeSlug, name, description, semester, coursesPerSemester, courseList };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const AcademicPlans = new AcademicPlanCollection();
