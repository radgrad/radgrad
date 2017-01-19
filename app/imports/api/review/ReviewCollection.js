import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Slugs } from '/imports/api/slug/SlugCollection';
import { Semesters } from '/imports/api/semester/SemesterCollection';
import { Opportunities } from '/imports/api/opportunity/OpportunityCollection';
import { Users } from '/imports/api/user/UserCollection';
import { Courses } from '/imports/api/course/CourseCollection';
import BaseInstanceCollection from '/imports/api/base/BaseInstanceCollection';
import { radgradCollections } from '/imports/api/integrity/RadGradCollections';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Meteor } from 'meteor/meteor';

/** @module Review */

/**
 * Represents an Opportunity, such as "LiveWire Internship".
 * To represent an Opportunity taken by a specific student in a specific semester, use OpportunityInstance.
 * @extends module:BaseInstance~BaseInstanceCollection
 */
class ReviewCollection extends BaseInstanceCollection {

  /**
   * Creates the Review collection.
   */
  constructor() {
    super('Review', new SimpleSchema({
      slugID: { type: SimpleSchema.RegEx.Id },
      studentID: { type: SimpleSchema.RegEx.Id },
      reviewType: { type: String },
      revieweeID: { type: SimpleSchema.RegEx.Id },
      semesterID: { type: SimpleSchema.RegEx.Id },
      rating: { type: Number },
      comments: { type: String },
      moderated: { type: Boolean },
      visible: { type: Boolean },
      moderatorComments: { type: String, optional: true},
    }));
  }

  /**
   * Defines a new Opportunity.
   * @example
   * Opportunities.define({ name: 'ATT Hackathon',
   *                        slug: 'att-hackathon',
   *                        description: 'Programming challenge at Sacred Hearts Academy, $10,000 prize',
   *                        opportunityType: 'event',
   *                        sponsor: 'philipjohnson',
   *                        ice: { i: 10, c: 0, e: 10},
   *                        interests: ['software-engineering'],
   *                        semesters: ['Fall-2016', 'Spring-2016', 'Summer-2106'],
    *                       moreInformation: 'http://atthackathon.com',
     *                      independentStudy: true});
   * @param { Object } description Object with keys student, reviewee, semester, rating, comments, moderated,
   * public, and moderatorComments.
   * Slug must not be previously defined.
   * OpportunityType and sponsor must be defined slugs.
   * Interests must be a (possibly empty) array of interest slugs or IDs.
   * Semesters must be a (possibly empty) array of semester slugs or IDs.
   * Sponsor must be a User with role 'FACULTY', 'ADVISOR', or 'ADMIN'.
   * ICE must be a valid ICE object.
   * MoreInformation is optional, but if supplied should be a URL.
   * IndependentStudy is optional and defaults to false.
   * @throws {Meteor.Error} If the definition includes a defined slug or undefined interest, sponsor, opportunityType,
   * or startActive or endActive are not valid.
   * @returns The newly created docID.
   */
  define({ slug, student, reviewType, reviewee, semester, rating, comments,
      moderated = false, visible = true, moderatorComments }) {
    // Get instances, or throw error
    const studentID = Users.getID(student);
    // Get instances, or throw error if not found or not a valid reviewType
    let revieweeID;
    if (reviewType === 'course') {
      revieweeID = Courses.getID(reviewee);
    } else if (reviewType === 'opportunity') {
      revieweeID = Opportunities.getID(reviewee);
    } else {
      throw new Meteor.Error(`reviewType ${reviewType} is not a valid reviewType.`);
    }
    console.log(semester);
    const semesterID = Semesters.getID(semester);
    // Make sure rating is a number between 1 and 5.
    if (!(typeof rating) === 'number' || (rating < 1) || (rating > 5)) {
      throw new Meteor.Error(`Rating ${rating} is not a number between 1 and 5.`);
    }
    // Guarantee that moderated and public are booleans.
    /* eslint no-param-reassign: "off" */
    moderated = !!moderated;
    visible = !!visible;
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the new Review and its Slug.
    const reviewID = this._collection.insert({ slugID, studentID, reviewType, revieweeID, semesterID,
      rating, comments, moderated, visible, moderatorComments });
    Slugs.updateEntityID(slugID, reviewID);

    // Return the id to the newly created Opportunity.
    return reviewID;
  }

  /**
   * Removes the passed Opportunity and its associated Slug.
   * @param opportunity The document or _id associated with this Opportunity.
   * @throws {Meteor.Error} If opportunity is not defined or there are any OpportunityInstances associated with it.
   */
  removeIt(review) {
    // TODO: check for defined OpportunityInstances before deletion.
    super.removeIt(review);
  }

  /**
   * Returns the slug for the given opportunity ID.
   * @param opportunityID the opportunity ID.
   */
  getSlug(reviewID) {
    this.assertDefined(reviewID);
    const reviewDoc = this.findDoc(reviewID);
    return Slugs.findDoc(reviewDoc.slugID).name;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, opportunityTypeID, sponsorID, interestIDs, semesterIDs
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach(doc => {
      if (!Slugs.isDefined(doc.slugID)) {
        problems.push(`Bad slugID: ${doc.slugID}`);
      }
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!Opportunities.isDefined(doc.revieweeID) && !Courses.isDefined(doc.revieweeID)) {
        problems.push(`Bad reviewee: ${doc.revieweeID}`);
      }
      if (!Semesters.isDefined(doc.semesterID)) {
        problems.push(`Bad studentID: ${doc.semesterID}`);
      }
  });
    return problems;
  }

  /**
   * Returns an object representing the Opportunity docID in a format acceptable to define().
   * @param docID The docID of an Opportunity.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const slug = Slugs.getNameFromID(doc.slugID);
    const student = Users.findSlugByID(doc.studentID);
    const reviewType = doc.reviewType;
    let reviewee;
    if (reviewType === 'course') {
      reviewee = Courses.findSlugByID(doc.revieweeID);
    } else if (reviewType === 'opportunity') {
      reviewee = Opportunities.findSlugByID(doc.revieweeID);
    }
    const semester = Semesters.findSlugByID(doc.semesterID);
    const rating = doc.rating;
    const comments = doc.comments;
    const moderated = doc.moderated;
    const visible = doc.visible;
    const moderatorComments = doc.moderatorComments;

    return { slug, student, reviewType, reviewee, semester, rating, comments, moderated, visible, moderatorComments  };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Reviews = new ReviewCollection();
radgradCollections.push(Reviews);
