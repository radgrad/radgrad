import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { AcademicPlans } from '../degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { DesiredDegrees } from '../degree-plan/DesiredDegreeCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { ROLE, isRole, assertRole } from '../role/Role';
import { Semesters } from '../semester/SemesterCollection';
import { getProjectedICE, getEarnedICE } from '../ice/IceProcessor';
import { Slugs } from '../slug/SlugCollection';


/** @module api/user/UserCollection */

/**
 * Represent a user. Users have roles: admin, advisor, alumni, faculty, student, mentor.
 * @extends module:api/base/BaseSlugCollection~BaseSlugCollection
 */
class UserCollection extends BaseSlugCollection {

  /**
   * Creates the User collection.
   */
  constructor() {
    super('User', new SimpleSchema({
      // Required field
      username: { type: String },
      // Everything else is optional, schema-wise.
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      slugID: { type: SimpleSchema.RegEx.Id, optional: true },
      email: { type: String, optional: true },
      password: { type: String, optional: true },
      uhID: { type: String, optional: true },
      careerGoalIDs: [SimpleSchema.RegEx.Id],
      interestIDs: [SimpleSchema.RegEx.Id],
      desiredDegreeID: { type: String, optional: true },
      picture: { type: String, optional: true },
      level: { type: Number, optional: true },
      website: { type: String, optional: true },
      hiddenCourseIDs: [SimpleSchema.RegEx.Id],
      hiddenOpportunityIDs: [SimpleSchema.RegEx.Id],
      declaredSemesterID: { type: SimpleSchema.RegEx.Id, optional: true },
      academicPlanID: { type: SimpleSchema.RegEx.Id, optional: true },
    }));
    // Use Meteor.users as the collection, not the User collection created by BaseCollection.
    this._collection = Meteor.users;

    // TODO: Enable simpleschema validation.
    // this._collection.attachSchema(this._schema);

    this._publicData = {
      fields: {
        firstName: 1,
        lastName: 1,
        slugID: 1,
        interestIDs: 1,
        careerGoalIDs: 1,
        picture: 1,
        roles: 1,
        username: 1,
        desiredDegreeID: 1,
        website: 1,
        emails: 1,
        academicPlanID: 1,
      },
    };
    this._privateData = { fields: { uhID: 1 } };
    // Define _allData as the union of public and private data.
    this._allData = { fields: {} };
    _.defaultsDeep(this._allData, this._publicData, this._privateData);
  }

  /**
   * Defines a new User.
   * @example
   * Users.define({ firstName: 'Joe',
   *                lastName: 'Smith',
   *                slug: 'joesmith',
   *                email: 'smith@hawaii.edu',
   *                role: ROLE.STUDENT,
   *                password: 'foo',
   *                // following fields are optional.
   *                uhID: '12345678',
   *                picture: 'http://johnson.github.io/images/profile.jpg',
   *                website: 'http://johnson.github.io/',
   *                interests: ['software-engineering'],
   *                careerGoals: ['application-developer'],
   *                desiredDegree: 'bs-cs',
   *                level: 1,
   *                hiddenCourses: ['ics312'],
   *                hiddenOpportunities: ['acm-icpc'],
   *                declaredSemester: 'Spring-2016',
   *               });
   * @param { Object } description Object with required keys firstName, lastName, slug, email, role, and password.
   * slug must be previously undefined. role must be a defined role.
   * picture, website, interests, careerGoals, hiddenCourseIDs, hiddenOpportunityIDs and desiredDegree are optional.
   * desiredDegree, if supplied, must be a DesiredDegree slug or docID.
   * Level defaults to 1.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  define({
      firstName, lastName, slug, email, role, password,
      picture = '/images/default-profile-picture.png', interests, careerGoals, desiredDegree,
      website, uhID, level = 1, hiddenCourses = [], hiddenOpportunities = [], declaredSemester = undefined,
  }) {
    // Users can only be defined on the server side.
    if (Meteor.isServer) {
      // Get SlugID, throw error if found.
      const slugID = Slugs.define({ name: slug, entityName: this.getType() });
      // Make sure role is supplied and is valid.
      if (!isRole(role)) {
        throw new Meteor.Error(`Role ${role} is not a valid role name.`);
      }
      const interestIDs = Interests.getIDs(interests);
      const careerGoalIDs = CareerGoals.getIDs(careerGoals);
      const hiddenCourseIDs = Courses.getIDs(hiddenCourses);
      const hiddenOpportunityIDs = Opportunities.getIDs(hiddenOpportunities);

      // desiredDegree is optional.
      const desiredDegreeID = (desiredDegree) ? DesiredDegrees.getID(desiredDegree) : undefined;
      // declaredSemester is optional.
      const declaredSemesterID = (declaredSemester) ? Semesters.getID(declaredSemester) : undefined;
      // Now define the user.
      let userID;
      if (password) {  // TODO: not sure this is the best way to distinguish the two cases.
        userID = Accounts.createUser({ username: slug, email, password });
      } else {
        const result = { id: slug };
        const options = { profile: { name: slug } };
        const casReturn = Accounts.updateOrCreateUserFromExternalService('cas', result, options);
        userID = casReturn.userId;
      }

      // Now that we have a user, update fields.
      Meteor.users.update(userID, {
        $set: {
          username: slug, firstName, lastName, slugID, email, picture, website, password,
          desiredDegreeID, interestIDs, careerGoalIDs, uhID, level, hiddenCourseIDs, hiddenOpportunityIDs,
          declaredSemesterID,
        },
      });

      Roles.addUsersToRoles(userID, [role]);

      // Update the Slug with the userID.
      Slugs.updateEntityID(slugID, userID);

      return userID;
    }
    return null;
  }

  /**
   * Updates the User document with the fields specified in userInfo.
   * This is intended to be called by the Users.update method.
   * @param userInfo An object containing user fields.
   */
  update(userInfo) {
    const userID = this.findIdBySlug(userInfo.username);
    this._collection.update(userID, { $set: userInfo });
  }

  /**
   * Adds user to the new role and removes user from old role.
   * @param userID the id of the user.
   * @param newRole The new role for the user.
   * @param newRole The old role for the user.
   */
  updateRole(userID, newRole, oldRole) {
    Roles.removeUsersFromRoles(userID, oldRole);
    Roles.addUsersToRoles(userID, newRole);
  }

  /**
   * Returns the full name for the given userID.
   * @param userID the id of the user.
   * @returns {string} The user's full name.
   * @throws {Meteor.Error} If userID is not a valid ID.
   */
  getFullName(userID) {
    this.assertDefined(userID);
    const user = this._collection.findOne({ _id: userID });
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Returns the user's roles.
   * @param userID the user's ID.
   * @returns {number|roles|{$in}|update.$addToSet.roles|{$each}|Array|String|*}
   */
  getRoles(userID) {
    this.assertDefined(userID);
    const user = this._collection.findOne({ _id: userID });
    return user.roles;
  }

  /**
   * Removes the user and their associated DegreePlan (if present) and their Slug.
   * @param user The object or docID representing this user.
   * @throws { Meteor.Error } if the user or their slug is not defined, or if the user has remaining
   * opportunity or course instances.
   */
  removeIt(user) {
    const docID = this.findDoc(user)._id;
    const courseInstanceCount = CourseInstances.find({ studentID: docID }).count();
    const opportunityInstanceCount = OpportunityInstances.find({ studentID: docID }).count();
    if ((courseInstanceCount + opportunityInstanceCount) === 0) {
      super.removeIt(user);
    } else {
      throw new Meteor.Error(`Attempt to remove ${user} while course or opportunity instances remain.`);
    }
  }

  /**
   * Remove all users with the associated role.
   * @param role The role.
   * @throws { Meteor.Error } If the role is not a defined role.
   */
  removeAllWithRole(role) {
    assertRole(role);
    this.find().forEach(user => {
      if (Roles.userIsInRole(user._id, [role])) {
        this.removeIt(user._id);
      }
    });
  }

  /**
   * Asserts that the passed user has one of the given roles.
   * @param userID The user.
   * @param role The role or an array of roles.
   * @throws { Meteor.Error } If the user does not have the role, or if user or role is not valid.
   */
  assertInRole(userID, role) {
    this.assertDefined(userID);
    assertRole(role);
    if (!Roles.userIsInRole(userID, role)) {
      throw new Meteor.Error(`${userID} (${this.findDoc(userID).firstName}) is not in role ${role}.`);
    }
  }

  /**
   * @returns {String | undefined} The user's email as a string, or undefined if not published.
   * @param userID The userID.
   * @throws {Meteor.Error} If userID is not a user ID.
   */
  getEmail(userID) {
    this.assertDefined(userID);
    const docID = this.findDoc(userID);
    return (docID.emails) ? docID.emails[0].address : undefined;
  }

  /**
   * Updates userID with UH ID.
   * @param userID The userID.
   * @param uhID The UH ID number, as a string.
   * @throws {Meteor.Error} If userID is not a userID, or if uhID is not a string.
   */
  setUhId(userID, uhID) {
    this.assertDefined(userID);
    check(uhID, String);
    this._collection.update(userID, { $set: { uhID } });
  }

  /**
   * Returns the user doc associated with the given uhID.
   * @param uhID the user's UH ID.
   * @returns Object the user doc associated with the given uhID or null if not found.
   */
  getUserFromUhId(uhID) {
    check(uhID, String);
    return this._collection.findOne({ uhID });
  }

  /**
   * Returns the user doc associated with the given username.
   * @param username the username.
   * @returns Object the user doc associated with the given username or null if not found.
   */
  getUserFromUsername(username) {
    check(username, String);
    return this._collection.findOne({ username });
  }

  /**
   * Updates userID with an array of careerGoalIDs.
   * @param userID The userID.
   * @param careerGoalIDs A list of careerGoalIDs.
   * @throws {Meteor.Error} If userID is not a userID, or if careerGoalIDs is not a list of careerGoalID.
   */
  setCareerGoalIds(userID, careerGoalIDs) {
    this.assertDefined(userID);
    CareerGoals.assertAllDefined(careerGoalIDs);
    this._collection.update(userID, { $set: { careerGoalIDs } });
  }

  /**
   * Updates email with new email address.
   * @param userID The userID.
   * @param email The user's email as a string.
   * @throws {Meteor.Error} If userID is not a userID
   */
  setEmail(userID, email) {
    this.assertDefined(userID);
    check(email, String);
    this._collection.update(userID, { $set: { email } });
  }

  /**
   * Updates website with new website address.
   * @param userID The userID.
   * @param email The user's website as a string.
   * @throws {Meteor.Error} If userID is not a userID
   */
  setWebsite(userID, website) {
    this.assertDefined(userID);
    check(website, String);
    this._collection.update(userID, { $set: { website } });
  }

  /**
   * Updates userID with an array of interestIDs.
   * @param userID The userID.
   * @param interestIDs A list of interestIDs.
   * @throws {Meteor.Error} If userID is not a userID, or if interestIDs is not a list of interestID.
   */
  setInterestIds(userID, interestIDs) {
    this.assertDefined(userID);
    Interests.assertAllDefined(interestIDs);
    this._collection.update(userID, { $set: { interestIDs } });
  }

  /**
   * Updates userID with picture.
   * @param userID The userID.
   * @param picture The user's picture as a URL string.
   * @throws {Meteor.Error} If userID is not a userID, or if picture is not a string.
   */
  setPicture(userID, picture) {
    this.assertDefined(userID);
    check(picture, String);
    this._collection.update(userID, { $set: { picture } });
  }

  /**
   * Updates userID with desiredDegree string.
   * @param userID The userID.
   * @param desiredDegree The desired degree, either a slug or a docID.
   * @throws {Meteor.Error} If userID is not a userID, or if desiredDegree is not defined.
   */
  setDesiredDegree(userID, desiredDegree) {
    this.assertDefined(userID);
    check(desiredDegree, String);
    const desiredDegreeID = DesiredDegrees.getID(desiredDegree);
    this._collection.update(userID, { $set: { desiredDegreeID } });
  }

  /**
   * Updates userID's level.
   * @param userID The userID.
   * @param level The new level.
   */
  setLevel(userID, level) {
    this.assertDefined(userID);
    check(level, Number);
    this._collection.update(userID, { $set: { level } });
  }

  /**
   * Updates userID with an array of hiddenCourseIDs.
   * @param userID The userID.
   * @param hiddenCourseIDs A list of courseIDs.
   * @throws {Meteor.Error} If userID is not a userID, or if hiddenCourseIDs is not a list of courseIDs.
   */
  setHiddenCourseIds(userID, hiddenCourseIDs) {
    this.assertDefined(userID);
    Courses.assertAllDefined(hiddenCourseIDs);
    this._collection.update(userID, { $set: { hiddenCourseIDs } });
  }

  /**
   * Updates userID with an array of hiddenOpportunityIDs.
   * @param userID The userID.
   * @param hiddenOpportunityIDs A list of opportunityIDs.
   * @throws {Meteor.Error} If userID is not a userID, or if hiddenOpportunityIDs is not a list of opportunityIDs.
   */
  setHiddenOpportunityIds(userID, hiddenOpportunityIDs) {
    this.assertDefined(userID);
    Opportunities.assertAllDefined(hiddenOpportunityIDs);
    this._collection.update(userID, { $set: { hiddenOpportunityIDs } });
  }

  /**
   * Updates user with userID's declaredSemesterID.
   * @param userID The userID.
   * @param declaredSemesterID The declared semester ID.
   */
  setDeclaredSemesterID(userID, declaredSemesterID) {
    this.assertDefined(userID);
    Semesters.assertDefined(declaredSemesterID);
    this._collection.update(userID, { $set: { declaredSemesterID } });
  }

  /**
   * Updates the user's academic plan ID.
   * @param userID The user's ID.
   * @param academicPlanID The academic plan's ID.
   */
  setAcademicPlanID(userID, academicPlanID) {
    this.assertDefined(userID);
    AcademicPlans.assertDefined(academicPlanID);
    this._collection.update(userID, { $set: { academicPlanID } });
  }

  /**
   * Returns an ICE object with the total earned course and opportunity ICE values.
   * @param studentID The userID.
   * @throws {Meteor.Error} If userID is not a userID.
   */
  getEarnedICE(studentID) {
    this.assertDefined(studentID);
    const courseDocs = CourseInstances.find({ studentID }).fetch();
    const oppDocs = OpportunityInstances.find({ studentID }).fetch();
    return getEarnedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns an ICE object with the total projected course and opportunity ICE values.
   * @param studentID The userID.
   * @throws {Meteor.Error} If userID is not a userID.
   */
  getProjectedICE(studentID) {
    this.assertDefined(studentID);
    const courseDocs = CourseInstances.find({ studentID }).fetch();
    const oppDocs = OpportunityInstances.find({ studentID }).fetch();
    return getProjectedICE(courseDocs.concat(oppDocs));
  }

  /**
   * Returns the slug name.
   * @param studentID The userID.
   * @throws {Meteor.Error} If userID is not a userID.
   */
  getSlugName(studentID) {
    this.assertDefined(studentID);
    const user = this._collection.findOne({ _id: studentID });
    return Slugs.getNameFromID(user.slugID);
  }
  /* eslint class-methods-use-this: "off" */

  /**
   * Returns an array of courseIDs that this user has taken (or plans to take) based on their courseInstances.
   * @param studentID The studentID.
   */
  getCourseIDs(studentID) {
    const courseInstanceDocs = CourseInstances.find({ studentID }).fetch();
    const courseIDs = courseInstanceDocs.map((doc) => doc.courseID);
    return _.uniq(courseIDs);
  }

  /**
   * Returns true if user has the specified career goal.
   * @param user The user (docID or slug)
   * @param careerGoal The Career Goal (docID or slug).
   * @returns {boolean} True if the user has the associated Career Goal.
   * @throws { Meteor.Error } If user is not a user or careerGoal is not a Career Goal.
   */
  hasCareerGoal(user, careerGoal) {
    const careerGoalID = CareerGoals.getID(careerGoal);
    const doc = this.findDoc(user);
    return _.includes(doc.careerGoalIDs, careerGoalID);
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
    _.map(user.careerGoalIDs, (goalID) => {
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
    _.map(user.careerGoalIDs, (goalID) => {
      const goal = CareerGoals.findDoc(goalID);
      careerInterestIDs = _.union(careerInterestIDs, goal.interestIDs);
    });
    careerInterestIDs = _.difference(careerInterestIDs, user.interestIDs);
    interestIDs.push(careerInterestIDs);
    return interestIDs;
  }

  publish() {
    if (Meteor.isServer) {
      Meteor.publish(this._collectionName, function publish() {
        const fields = (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) ? this._allData : this._publicData;
        return Meteor.users.find({}, fields);
      });
    }
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, careerGoalIDs, interestIDs, desiredDegreeID
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (doc.desiredDegreeID && !DesiredDegrees.isDefined(doc.desiredDegreeID)) {
        problems.push(`Bad desiredDegreeID: ${doc.desiredDegreeID}`);
      }
      _.forEach(doc.careerGoalIDs, careerGoalID => {
        if (!CareerGoals.isDefined(careerGoalID)) {
          problems.push(`Bad careerGoalID: ${careerGoalID}`);
        }
      });
      _.forEach(doc.interestIDs, interestID => {
        if (!Interests.isDefined(interestID)) {
          problems.push(`Bad interestID: ${interestID}`);
        }
      });
      _.forEach(doc.hiddenCourseIDs, hiddenCourseID => {
        if (!Courses.isDefined(hiddenCourseID)) {
          problems.push(`Bad hiddenCourseID: ${hiddenCourseID}`);
        }
      });
      _.forEach(doc.hiddenOpportunityIDs, hiddenOpportunityID => {
        if (!Opportunities.isDefined(hiddenOpportunityID)) {
          problems.push(`Bad hiddenOpportunityID: ${hiddenOpportunityID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the User docID in a format acceptable to define().
   * @param docID The docID of an User.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const slug = Slugs.getNameFromID(doc.slugID);
    const email = doc.email;
    const password = doc.password;
    const role = Roles.getRolesForUser(docID)[0];
    const uhID = doc.uhID;
    const picture = doc.picture;
    const website = doc.website;
    const interests = _.map(doc.interestIDs, interestID => Interests.findSlugByID(interestID));
    const careerGoals = _.map(doc.careerGoalIDs, careerGoalID => CareerGoals.findSlugByID(careerGoalID));
    const desiredDegree = doc.desiredDegreeID && DesiredDegrees.findSlugByID(doc.desiredDegreeID);
    const level = doc.level;
    const hiddenCourses = _.map(doc.hiddenCourseIDs, hiddenCourseID => Courses.findSlugByID(hiddenCourseID));
    const hiddenOpportunities = _.map(doc.hiddenOpportunityIDs, hiddenOpportunityID =>
        Opportunities.findSlugByID(hiddenOpportunityID));

    return { firstName, lastName, slug, email, password, role, uhID, picture, website, interests, careerGoals,
      desiredDegree, level, hiddenCourses, hiddenOpportunities };
  }

}

/**
 * Provides the singleton instance of this class to other entities.
 */
export const Users = new UserCollection();
