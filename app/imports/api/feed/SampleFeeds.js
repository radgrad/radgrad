import { FeedTypes } from '../feed/FeedTypeCollection';

/** @module api/feed/SampleFeeds */

/**
 * Creates a FeedType with a unique slug and returns its docID.
 * @returns { String } The docID of the newly generated FeedType.
 */
export function makeSampleFeedType() {
  const name = 'Sample Feed Type';
  const slug = 'new-user';
  const description = 'Sample Feed Type Description';
  return FeedTypes.define({ name, slug, description });
}
