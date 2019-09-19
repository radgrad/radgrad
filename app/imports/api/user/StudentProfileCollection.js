import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import BaseProfileCollection, { defaultProfilePicture } from './BaseProfileCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';
import { Slugs } from '../slug/SlugCollection';
import { ROLE } from '../role/Role';
import { getProjectedICE, getEarnedICE } from '../ice/IceProcessor';
import { StudentParticipation } from '../public-stats/StudentParticipationCollection';

/**
 * Represents a Student Profile.
 * @extends api/user.BaseProfileCollection
 * @memberOf api/user
 */
class StudentProfileCollection extends BaseProfileCollection {
  constructor() {
    super('StudentProfile', new SimpleSchema({
      level: { type: SimpleSchema.Integer, min: 1, max: 6 },
      academicPlanID: { type: SimpleSchema.RegEx.Id, optional: true },
      declaredSemesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      hiddenCourseIDs: [SimpleSchema.RegEx.Id],
      hiddenOpportunityIDs: [SimpleSchema.RegEx.Id],
      isAlumni: Boolean,
      shareAcademicPlan: { type: Boolean, optional: true },
      shareOpportunities: { type: Boolean, optional: true },
      shareCourses: { type: Boolean, optional: true },
      shareLevel: { type: Boolean, optional: true },
    }));
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
   * @param shareUsername An optional boolean indicating if this student is sharing their username. Defaults to false.
   * @param sharePicture An optional boolean indicating if this student is sharing their picture. Defaults to false.
   * @param shareWebsite An optional boolean indicating if this student is sharing their website. Defaults to false.
   * @param shareInterests An optional boolean indicating if this student is sharing their interests. Defaults to false.
   * @param shareCareerGoals An optional boolean indicating if this student is sharing their career goals. Defaults to
   * false.
   * @param shareAcademicPlan An optional boolean indicating if this student is sharing their academic plans. Defaults
   * to false.
   * @param shareCourses An optional boolean indicating if this student is sharing their courses. Defaults to false.
   * @param shareOpportunities An optional boolean indicating if this student is sharing their opportunities. Defaults
   * to false.
   * @param shareLevel An optional boolean indicating if this student is sharing their level. Defaults to false.
   * @param retired the retired status (optional).
   * @throws { Meteor.Error } If username has been previously defined, or if any interests, careerGoals, level,
   * academicPlan, declaredSemester, hiddenCourses, or hiddenOpportunities are invalid.
   * @return { String } The docID of the StudentProfile.
   */
  define({
           username, firstName, lastName, picture = defaultProfilePicture, website, interests,
           careerGoals, level, academicPlan, declaredSemester, hiddenCourses = [], hiddenOpportunities = [],
           isAlumni = false, retired, shareUsername = false, sharePicture = false, shareWebsite = false,
           shareInterests = false, shareCareerGoals = false, shareAcademicPlan = false, shareCourses = false,
           shareOpportunities = false, shareLevel = false,
         }) {
    if (Meteor.isServer) {
      // Validate parameters.
      const interestIDs = Interests.getIDs(interests);
      const careerGoalIDs = CareerGoals.getIDs(careerGoals);
      const academicPlanID = (academicPlan) ? AcademicPlans.getID(academicPlan) : undefined;
      const declaredSemesterID = (declaredSemester) ? Semesters.getID(declaredSemester) : undefined;
      const hiddenCourseIDs = Courses.getIDs(hiddenCourses);
      const hiddenOpportunityIDs = Opportunities.getIDs(hiddenOpportunities);
      this.assertValidLevel(level);
      if (!_.isBoolean(isAlumni)) {
        throw new Meteor.Error(`Invalid isAlumni: ${isAlumni}`, '', Error().stack);
      }

      // Create the slug, which ensures that username is unique.
      Slugs.define({ name: username, entityName: this.getType() });
      const role = (isAlumni) ? ROLE.ALUMNI : ROLE.STUDENT;
      const profileID = this._collection.insert({
        username,
        firstName,
        lastName,
        role,
        picture,
        website,
        interestIDs,
        careerGoalIDs,
        level,
        academicPlanID,
        declaredSemesterID,
        hiddenCourseIDs,
        hiddenOpportunityIDs,
        isAlumni,
        userID: this.getFakeUserId(),
        retired,
        shareUsername,
        sharePicture,
        shareWebsite,
        shareInterests,
        shareCareerGoals,
        shareAcademicPlan,
        shareCourses,
        shareOpportunities,
        shareLevel,
      });
      const userID = Users.define({ username, role });
      // console.log('StudentProfile userID=%o', userID);
      this._collection.update(profileID, { $set: { userID } });
      // console.log(this._collection.find({ _id: profileID }).fetch());
      return profileID;
    }
    return undefined;
  }

  /**
   * Updates the StudentProfile.
   * You cannot change the username or role once defined. (You can implicitly change the role by setting isAlumni).
   * Users in ROLE.STUDENT cannot change their level or isAlumni setting.
   * @param docID the id of the StudentProfile.
   * @param company the company (optional).
   * @param careerGoals the career (optional).
   * @param level the level (optional).
   * @param academicPlan the chosen academic plan (optional).
   * @param declaredSemester the semester they declared their major (optional).
   * @param hiddenCourses an array of courses they chose to not see (optional).
   * @param hiddenOpportunities an array of opportunities they chose to not see (optional).
   * @param isAlumni their alumni status (optional).
   * @param retired their retired status (optional).
   */
  update(docID, {
    firstName, lastName, picture, website, interests, careerGoals, level, academicPlan, declaredSemester,
    hiddenCourses, hiddenOpportunities, isAlumni, retired, shareUsername, sharePicture, shareWebsite, shareInterests,
    shareCareerGoals, shareAcademicPlan, shareCourses, shareOpportunities, shareLevel, courseExplorerFilter,
    opportunityExplorerSortOrder,
  }) {
    this.assertDefined(docID);
    const profile = this.findDoc(docID);
    const updateData = {};
    this._updateCommonFields(updateData, { firstName, lastName, picture, website, interests, careerGoals, retired });
    if (academicPlan) {
      updateData.academicPlanID = AcademicPlans.getID(academicPlan);
      if (profile.academicPlanID !== updateData.academicPlanID) {
        const oldItem = StudentParticipation.findOne({ itemID: profile.academicPlanID });
        if (oldItem) {
          // update the old and new AcademicPlan participation
        }
      }
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
    if (Meteor.isTest || !Meteor.userId() || this._hasRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR])) {
      const userID = this.findDoc(docID).userID;
      if (_.isBoolean(isAlumni)) {
        updateData.isAlumni = isAlumni;
        if (isAlumni) {
          updateData.role = ROLE.ALUMNI;
          Roles.addUsersToRoles(userID, [ROLE.ALUMNI]);
          Roles.removeUsersFromRoles(userID, ROLE.STUDENT);
        } else {
          updateData.role = ROLE.STUDENT;
          Roles.addUsersToRoles(userID, [ROLE.STUDENT]);
          Roles.removeUsersFromRoles(userID, ROLE.ALUMNI);
        }
      }
      if (level) {
        this.assertValidLevel(level);
        updateData.level = level;
      }
      if (_.isBoolean(retired)) {
        updateData.retired = retired;
      }
    }
    if (_.isBoolean(shareUsername)) {
      updateData.shareUsername = shareUsername;
    }
    if (_.isBoolean(sharePicture)) {
      updateData.sharePicture = sharePicture;
    }
    if (_.isBoolean(shareWebsite)) {
      updateData.shareWebsite = shareWebsite;
    }
    if (_.isBoolean(shareInterests)) {
      updateData.shareInterests = shareInterests;
    }
    if (_.isBoolean(shareCareerGoals)) {
      updateData.shareCareerGoals = shareCareerGoals;
    }
    if (_.isBoolean(shareAcademicPlan)) {
      updateData.shareAcademicPlan = shareAcademicPlan;
    }
    if (_.isBoolean(shareCourses)) {
      updateData.shareCourses = shareCourses;
    }
    if (_.isBoolean(shareOpportunities)) {
      updateData.shareOpportunities = shareOpportunities;
    }
    if (_.isBoolean(shareLevel)) {
      updateData.shareLevel = shareLevel;
    }
    if (courseExplorerFilter) {
      updateData.courseExplorerFilter = courseExplorerFilter;
    }
    if (opportunityExplorerSortOrder) {
      updateData.opportunityExplorerSortOrder = opportunityExplorerSortOrder;
    }
    // console.log('StudentProfile.update %o', updateData);
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  removeIt(profileID) {
    if (this.isDefined(profileID)) {
      const doc = this.findDoc(profileID);
      if (doc.declaredSemesterID) {
        Semesters.removeIt(doc.declaredSemesterID);
      }
      super.removeIt(profileID);
    }
  }

  /**
   * Asserts that level is an integer between 1 and 6.
   * @param level The level.
   */
  assertValidLevel(level) {  // eslint-disable-line class-methods-use-this
    if (!_.isInteger(level) && !_.inRange(level, 1, 7)) {
      throw new Meteor.Error(`Level ${level} is not between 1 and 6.`, '', Error().stack);
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
    this.find()
      .forEach(doc => {
        problems = problems.concat(this._checkIntegrityCommonFields(doc));
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
   * Returns an ICE object with the total earned course and opportunity ICE values.
   * @param user The student (username or userID).
   * @throws {Meteor.Error} If userID is not defined.
   */
  getEarnedICE(user) { // eslint-disable-line
    const studentID = Users.getID(user);
    const courseDocs = CourseInstances.find({ studentID })
      .fetch();
    const oppDocs = OpportunityInstances.find({ studentID })
      .fetch();
    return getEarnedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns an ICE object with the total projected course and opportunity ICE values.
   * @param user The student (username or userID).
   * @throws {Meteor.Error} If user is not defined.
   */
  getProjectedICE(user) { // eslint-disable-line class-methods-use-this
    const studentID = Users.getID(user);
    const courseDocs = CourseInstances.find({ studentID })
      .fetch();
    const oppDocs = OpportunityInstances.find({ studentID })
      .fetch();
    return getProjectedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns an array of courseIDs that this user has taken (or plans to take) based on their courseInstances.
   * @param studentID The studentID.
   */
  getCourseIDs(user) { // eslint-disable-line class-methods-use-this
    const studentID = Users.getID(user);
    const courseInstanceDocs = CourseInstances.find({ studentID })
      .fetch();
    const courseIDs = courseInstanceDocs.map((doc) => doc.courseID);
    return courseIDs; // allow for multiple 491 or 499 classes.
    // return _.uniq(courseIDs);
  }

  /**
   * Returns the user's interests as IDs. It is a union of interestIDs and careerGoal interestIDs.
   * @param userID
   * @returns {Array}
   */
  getInterestIDs(userID) {
    const user = this._collection.findOne({ _id: userID });
    let interestIDs = [];
    interestIDs = _.union(interestIDs, user.interestIDs);
    _.forEach(user.careerGoalIDs, (goalID) => {
      const goal = CareerGoals.findDoc(goalID);
      interestIDs = _.union(interestIDs, goal.interestIDs);
    });
    return interestIDs;
  }

  /**
   * Returns the user's interest IDs in an Array with two sub-arrays. The first sub-array is the interest IDs that the
   * User selected. The second sub-array is the interestIDs from the user's career goals.
   * @param userID The user's ID.
   */
  getInterestIDsByType(userID) {
    const user = this._collection.findOne({ _id: userID });
    const interestIDs = [];
    interestIDs.push(user.interestIDs);
    let careerInterestIDs = [];
    _.forEach(user.careerGoalIDs, (goalID) => {
      const goal = CareerGoals.findDoc(goalID);
      careerInterestIDs = _.union(careerInterestIDs, goal.interestIDs);
    });
    careerInterestIDs = _.difference(careerInterestIDs, user.interestIDs);
    interestIDs.push(careerInterestIDs);
    return interestIDs;
  }

  /**
   * Updates user's level.
   * @param user The user (username or userID).
   * @param level The new level.
   */
  setLevel(user, level) {
    const id = this.getID(user);
    this._collection.update({ _id: id }, { $set: { level } });
  }

  /**
   * Updates the user's sharePicture value. If they have set their picture then they want to share the picture.
   * @param user The user (username or userID).
   */
  setSharePicture(user) {
    const id = this.getID(user);
    this._collection.update({ _id: id }, { $set: { sharePicture: this.hasSetPicture(user) } });
  }

  /**
   * Depending on the logged in user publish only their StudentProfile information if they opt-in. If
   * the user is in the Role.ADMIN or ADVISOR then publish all information.
   */
  publish() {
    if (Meteor.isServer) {
      const inst = this;
      Meteor.publish(this._collectionName, function () {
        const userID = Meteor.userId();
        ReactiveAggregate(this, inst._collection, [{
          $project: {
            username: {
              $cond: [{
                $or: [
                  { $ifNull: ['$shareUsername', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$username', ''],
            },
            firstName: 1,
            lastName: 1,
            role: 1,
            picture: {
              $cond: [{
                $or: [
                  { $ifNull: ['$sharePicture', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$picture', '/images/default-profile-picture.png'],
            },
            website: {
              $cond: [{
                $or: [
                  { $ifNull: ['$shareWebsite', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$website', ''],
            },
            interestIDs: {
              $cond: [{
                $or: [
                  { $ifNull: ['$shareInterests', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$interestIDs', []],
            },
            careerGoalIDs: {
              $cond: [{
                $or: [
                  { $ifNull: ['$shareCareerGoals', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$careerGoalIDs', []],
            },
            userID: 1,
            retired: 1,
            level: {
              $cond: [{
                $or: [
                  { $ifNull: ['$shareLevel', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$level', 0],
            },
            academicPlanID: {
              $cond: [{
                $or: [
                  { $ifNull: ['$shareAcademicPlan', false] },
                  { $eq: [userID, '$userID'] },
                  { $eq: [Roles.userIsInRole(userID, [ROLE.ADMIN, ROLE.ADVISOR]), true] },
                ],
              }, '$academicPlanID', ''],
            },
            declaredSemesterID: 1,
            hiddenCourseIDs: 1,
            hiddenOpportunityIDs: 1,
            isAlumni: 1,
            shareUsername: 1,
            sharePicture: 1,
            shareWebsite: 1,
            shareInterests: 1,
            shareCareerGoals: 1,
            shareAcademicPlan: 1,
            shareOpportunities: 1,
            shareCourses: 1,
            shareLevel: 1,
            courseExplorerFilter: 1,
            opportunityExplorerSortOrder: 1,
            optedIn: {
              $cond: [{
                $or: [
                  '$shareUsername',
                  '$sharePicture',
                  '$shareWebsite',
                  '$shareInterests',
                  '$shareCareerGoals',
                  '$shareAcademicPlan',
                  '$shareOpportunities',
                  '$shareCourses',
                  '$shareLevel',
                ],
              }, true, false],
            },
          },
        }]);
      });
    }
  }

  /**
   * Returns an object representing the StudentProfile docID in a format acceptable to define().
   * @param docID The docID of a StudentProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    // console.log('StudentProfiles.dumpOne %o', doc);
    const username = doc.username;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const picture = doc.picture;
    const website = doc.website;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const careerGoals = _.map(doc.careerGoalIDs, careerGoalID => CareerGoals.findSlugByID(careerGoalID));
    const level = doc.level;
    const academicPlan = doc.academicPlanID && AcademicPlans.findSlugByID(doc.academicPlanID);
    const declaredSemester = doc.declaredSemesterID && Semesters.getSlug(doc.declaredSemesterID);
    const hiddenCourses = _.map(doc.hiddenCourseIDs, hiddenCourseID => Courses.findSlugByID(hiddenCourseID));
    const hiddenOpportunities = _.map(doc.hiddenOpportunityIDs, hiddenOpportunityID =>
      Opportunities.findSlugByID(hiddenOpportunityID));
    const isAlumni = doc.isAlumni;
    const retired = doc.retired;
    const shareUsername = doc.shareUsername;
    const sharePicture = doc.sharePicture;
    const shareWebsite = doc.shareWebsite;
    const shareInterests = doc.shareInterests;
    const shareCareerGoals = doc.shareCareerGoals;
    const shareOpportunities = doc.shareOpportunities;
    const shareCourses = doc.shareCourses;
    const shareLevel = doc.shareLevel;
    return {
      username, firstName, lastName, picture, website, interests, careerGoals, level, academicPlan,
      declaredSemester, hiddenCourses, hiddenOpportunities, isAlumni, retired, shareUsername, sharePicture,
      shareWebsite, shareInterests, shareCareerGoals, shareOpportunities, shareCourses, shareLevel,
    };
  }
}

/**
 * Provides the singleton instance this collection to all other entities.
 * @type {api/user.StudentProfileCollection}
 * @memberOf api/user
 */
export const StudentProfiles = new StudentProfileCollection();
