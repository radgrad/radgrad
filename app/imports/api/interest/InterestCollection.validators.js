import { Interests } from './InterestCollection';

/**
 * Custom validator for fields that must contain an Interest slug.
 * @returns Undefined if the value is an Interest slug, otherwise returns 'undefinedInterestSlug'.
 * @throws Error if there are no Slugs in the SlugCollection.
 * @memberOf api/interest
 */
export function isInterestSlugValidator() {
  const ret = (Interests.hasSlug(this.value)) ? undefined : 'undefinedInterestSlug';
  console.log('isInterestSlugValidator', ret, this.value, Interests.hasSlug(this.value));
  return ret;
}

/**
 * Custom validator for fields that must contain an Interest slug.
 * @returns Undefined if the value is an Interest slug, otherwise returns 'undefinedInterestSlug'.
 * @throws Error if there are no Slugs in the SlugCollection.
 * @memberOf api/interest
 */
export function isInterestArrayValidator() {
  const ret = (Interests.hasSlug(this.value[0])) ? undefined : 'undefinedInterestSlug';
  console.log('isInterestSlugValidator', ret, this.value, Interests.hasSlug(this.value));
  return ret;
}
