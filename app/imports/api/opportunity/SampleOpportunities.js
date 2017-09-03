import { moment } from 'meteor/momentjs:moment';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { makeSampleInterest } from '../interest/SampleInterests';


/**
 * Creates an OpportunityType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated OpportunityType.
 * @memberOf api/opportunity
 */
export function makeSampleOpportunityType() {
  const name = 'Sample Opportunity Type';
  const slug = `opportunity-type-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  const description = 'Sample Opportunity Type Description';
  return OpportunityTypes.define({ name, slug, description });
}

/**
 * Creates an Opportunity with a unique slug and returns its docID.
 * @param sponsor The slug for the user (with Role.FACULTY) to be the sponsor for this opportunity.
 * Also creates a new OpportunityType.
 * @returns { String } The docID for the newly generated Opportunity.
 * @memberOf api/opportunity
 */
export function makeSampleOpportunity(sponsor) {
  const name = 'Sample Opportunity';
  const slug = `opportunity-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  const description = 'Sample Opportunity Description';
  const opportunityType = makeSampleOpportunityType();
  const interests = [makeSampleInterest()];
  const semester = Semesters.define({ term: Semesters.SPRING, year: 2015 });
  const semesters = [semester];
  const ice = { i: 10, c: 0, e: 10 };
  return Opportunities.define({ name, slug, description, opportunityType, sponsor, interests, semesters, ice });
}

/**
 * Creates an OpportunityInstance with a unique slug and returns its docID.
 * @param student The slug for the user (with ROLE.STUDENT) who is taking advantage of this opportunity.
 * @param sponsor The slug for the user (with ROLE.FACULTY) who is sponsoring the opportunity.
 * Implicitly creates an Opportunity and an OpportunityType.
 * @memberOf api/opportunity
 */
export function makeSampleOpportunityInstance(student, sponsor) {
  const semester = Semesters.define({ term: Semesters.SPRING, year: 2015 });
  const opportunity = makeSampleOpportunity(sponsor);
  const verified = false;
  return OpportunityInstances.define({ semester, opportunity, verified, student });
}
