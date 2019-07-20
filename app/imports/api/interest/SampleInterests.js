import { moment } from 'meteor/momentjs:moment';
import { InterestTypes } from '../interest/InterestTypeCollection';
import { Interests } from '../interest/InterestCollection';

export const sampleInterestTypeName = 'Sample Interest Type';
export const sampleInterestName = 'Sample Interest';
/**
 * Creates an InterestType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated InterestType.
 * @memberOf api/interest
 */
export function makeSampleInterestType() {
  const name = sampleInterestTypeName;
  const slug = `interest-type-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  const description = 'Sample Interest Type Description';
  return InterestTypes.define({ name, slug, description });
}

/**
 * Creates an Interest with a unique slug and returns its docID.
 * Also creates a new InterestType.
 * @returns { String } The docID for the newly generated Interest.
 * @memberOf api/interest
 */
export function makeSampleInterest() {
  const interestType = makeSampleInterestType();
  const name = sampleInterestName;
  const slug = `interest-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`;
  const description = 'Sample Interest Description';
  return Interests.define({ name, slug, description, interestType });
}
