import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/erasaur:meteor-lodash';
import BaseCollection from '../base/BaseCollection';

class CourseAndOpportunityEnrollmentCollection extends BaseCollection {
  constructor() {
    super('CourseAndOpportunityEnrollment', new SimpleSchema({
      itemID: SimpleSchema.RegEx.Id,
      itemSlug: String,
      itemCount: SimpleSchema.Integer,
    }));
  }

  define({ itemSlug, itemCount }) {
    const doc = this._collection.findOne({ itemSlug });
    if (doc) {
      return doc._id;
    }
    if (!Slugs.isDefined(itemSlug)) {
      throw new Meteor.Error(`${itemSlug} is not a defined slug.`);
    }
    const slug = Slugs.findDoc(itemSlug);
    const itemID = slug.entityID;
    return this._collection.insert({ itemID, itemSlug, itemCount });
  }
}
