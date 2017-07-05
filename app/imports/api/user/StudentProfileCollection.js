import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { profileCommonSchema, updateCommonFields, checkIntegrityCommonFields } from './ProfileCommonSchema';

/** @module api/user/StudentProfileCollection */
/**
 * Represents a Student Profile.
 * @extends module:api/base/BaseCollection~BaseSlugCollection
 */
class StudentProfileCollection extends BaseSlugCollection {
  constructor() {
    super('StudentProfile', new SimpleSchema({
      level: { type: SimpleSchema.Integer, min: 1, max: 6 },
      academicPlanID: { type: SimpleSchema.RegEx.Id, optional: true },
      declaredSemesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      hiddenCourseIDs: [SimpleSchema.RegEx.Id],
      hiddenOpportunityIDs: [SimpleSchema.RegEx.Id],
      isAlumni: Boolean,
    }).extend(profileCommonSchema));
  }

  /**
   * Defines the profile associated with a Student.
   * The username does not need to be defined in Meteor Accounts yet, but it must be a unique Slug.
   * @param username The username string associated with this profile, which should be an email.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param picture The URL to their picture. (optional, defaults to a default picture.)
   * @param website The URL to their personal website (optional).
   * @param interests An array of interests. (optional)
   * @param careerGoals An array of career goals. (optional)
   * @param level An integer between 1 and 6 indicating the student's level.
   * @param academicPlan An optional slug indicating the academic plan.
   * @param declaredSemester An optional string indicating the student's declared semester.
   * @param hiddenCourses An optional array of course slugs indicating the hidden ones.
   * @param hiddenOpportunities An optional array of opportunity slugs indicating the hidden opportunities.
   * @param isAlumni An optional boolean indicating if this student has graduated. Defaults to false.
   * @throws { Meteor.Error } If username has been previously defined, or if any interests, careerGoals, level,
   * academicPlan, declaredSemester, hiddenCourses, or hiddenOpportunities are invalid.
   * @return { String } The docID of the StudentProfile.
   */
  define({ username, firstName, lastName, picture = '/images/default-profile-picture.png', website, interests,
           careerGoals, level, academicPlan, declaredSemester, hiddenCourses = [], hiddenOpportunities = [],
           isAlumni = false }) {
    // Validate parameters.
    const interestIDs = Interests.getIDs(interests);
    const careerGoalIDs = CareerGoals.getIDs(careerGoals);
    const academicPlanID = (academicPlan) ? AcademicPlans.getID(academicPlan) : undefined;
    const declaredSemesterID = (declaredSemester) ? Semesters.getID(declaredSemester) : undefined;
    const hiddenCourseIDs = Courses.getIDs(hiddenCourses);
    const hiddenOpportunityIDs = Opportunities.getIDs(hiddenOpportunities);
    this.assertValidLevel(level);
    if (!_.isBoolean(isAlumni)) {
      throw new Meteor.Error(`Invalid isAlumni: ${isAlumni}`);
    }

    // Create the slug, which ensures that username is unique.
    Slugs.define({ name: username, entityName: this.getType() });
    const role = (isAlumni) ? ROLE.ALUMNI : ROLE.STUDENT;
    const userID = Users.define({ username, role });
    return this._collection.insert({ username, firstName, lastName, role, picture, website, interestIDs, careerGoalIDs,
      level, academicPlanID, declaredSemesterID, hiddenCourseIDs, hiddenOpportunityIDs, isAlumni, userID });
  }

  /**
   * Updates the StudentProfile.
   * You cannot change the username or role once defined. (You can implicitly change the role by setting isAlumni).
   * Users in ROLE.STUDENT cannot change their level or isAlumni setting.
   * @param docID the id of the StudentProfile.
   * @param company the company (optional).
   * @param career the career (optional).
   * @param location the location (optional).
   * @param linkedin LinkedIn user ID (optional).
   * @param motivation the motivation (optional).
   */
  update(docID, { firstName, lastName, picture, website, interests, careerGoals, level, academicPlan, declaredSemester,
      hiddenCourses, hiddenOpportunities, isAlumni }) {
    this.assertDefined(docID);
    const updateData = {};
    updateCommonFields(updateData, { firstName, lastName, picture, website, interests, careerGoals });
    if (academicPlan) {
      updateData.academicPlanID = AcademicPlans.getID(academicPlan);
    }
    if (declaredSemester) {
      updateData.declaredSemesterID = Semesters.getID(declaredSemester);
    }
    if (hiddenCourses) {
      updateData.hiddenCourseIDs = Courses.getIDs(hiddenCourses);
    }
    if (hiddenOpportunities) {
      updateData.hiddenOpportunityIDs = Opportunities.getIDs(hiddenOpportunities);
    }

    // Only Admins and Advisors can update the isAlumni and level fields.
    // Or if no one is logged in when this is executed (i.e. for testing) then it's cool.
    if (!Meteor.userId() || this._assertRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR])) {
      if (isAlumni) {
        updateData.isAlumni = isAlumni;
        updateData.role = (isAlumni) ? ROLE.ALUMNI : ROLE.STUDENT;
      }
      if (level) {
        this.assertValidLevel(level);
        updateData.level = level;
      }
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Returns the profile associated with the specified user.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document.
   * @throws { Meteor.Error } If user is not a valid user, or profile is not found.
   */
  getProfile(user) {
    const userID = Users.getID(user);
    const doc = this.findOne({ userID });
    if (!doc) {
      throw new Meteor.Error(`No Student profile found for user ${user}`);
    }
    return doc;
  }

  /**
   * Returns non-null if the user has a profile in this collection.
   * @param user The user (either their username (email) or their userID).
   * @return The profile document if the profile exists, or null if not found.
   * @throws { Meteor.Error } If user is not a valid user.
   */
  hasProfile(user) {
    const userID = Users.getID(user);
    return this.findOne({ userID });
  }

  /**
   * Asserts that level is an integer between 1 and 6.
   * @param level The level.
   */
  assertValidLevel(level) {  // eslint-disable-line class-methods-use-this
    if (!_.isInteger(level) && !_.inRange(level, 1, 7)) {
      throw new Meteor.Error(`Level ${level} is not between 1 and 6.`);
    }
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
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    let problems = [];
    this.find().forEach(doc => {
      problems = problems.concat(checkIntegrityCommonFields(doc));
      if ((doc.role !== ROLE.STUDENT) && (doc.role !== ROLE.ALUMNI)) {
        problems.push(`StudentProfile instance does not have ROLE.STUDENT or ROLE.ALUMNI: ${doc.username}`);
      }
      if (!_.isInteger(doc.level) && !_.inRange(doc.level, 1, 7)) {
        problems.push(`Level ${doc.level} is not an integer between 1 and 6 in ${doc.username}`);
      }
      if (!_.isBoolean(doc.isAlumni)) {
        problems.push(`Invalid isAlumni: ${doc.isAlumni} in ${doc.username}`);
      }
      if (doc.academicPlanID && !AcademicPlans.isDefined(doc.academicPlanID)) {
        problems.push(`Bad academicPlanID: ${doc.academicPlanID} in ${doc.username}`);
      }
      if (doc.declaredSemesterID && !Semesters.isDefined(doc.declaredSemesterID)) {
        problems.push(`Bad semesterID: ${doc.academicPlanID} in ${doc.username}`);
      }
      _.forEach(doc.hiddenCourseIDs, hiddenCourseID => {
        if (!Courses.isDefined(hiddenCourseID)) {
          problems.push(`Bad hiddenCourseID: ${hiddenCourseID} in ${doc.username}`);
        }
      });
      _.forEach(doc.hiddenOpportunityIDs, hiddenOpportunityID => {
        if (!Opportunities.isDefined(hiddenOpportunityID)) {
          problems.push(`Bad hiddenOpportunityID: ${hiddenOpportunityID} in ${doc.username}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the StudentProfile docID in a format acceptable to define().
   * @param docID The docID of a StudentProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const website = doc.website;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const careerGoals = _.map(doc.careerGoalIDs, careerGoalID => CareerGoals.findSlugByID(careerGoalID));
    const level = doc.level;
    const academicPlan = doc.academicPlanID && AcademicPlans.findSlugByID(doc.academicPlanID);
    const declaredSemester = doc.declaredSemesterID && Semesters.findSlugByID(doc.declaredSemesterID);
    const hiddenCourses = _.map(doc.hiddenCourseIDs, hiddenCourseID => Courses.findSlugByID(hiddenCourseID));
    const hiddenOpportunities = _.map(doc.hiddenOpportunityIDs, hiddenOpportunityID =>
        Opportunities.findSlugByID(hiddenOpportunityID));
    const isAlumni = doc.isAlumni;
    return { username, firstName, lastName, picture, website, interests, careerGoals, level, academicPlan,
      declaredSemester, hiddenCourses, hiddenOpportunities, isAlumni };
  }
}

export const StudentProfiles = new StudentProfileCollection();
