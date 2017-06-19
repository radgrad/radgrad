import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

// /** @module ui/components/admin/Update_Teaser_Widget */

const updateSchema = new SimpleSchema({
  title: String,
  author: String,
  url: String,
  description: String,
  duration: { type: String, optional: true },
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  opportunity: String,
}, { tracker: Tracker });

Template.Update_Teaser_Widget.onCreated(function onCreated() {
  FormUtils.setupFormWidget(this, updateSchema);
});

Template.Update_Teaser_Widget.helpers({
  teaser() {
    return Teasers.findDoc(Template.currentData().updateID.get());
  },
  slug() {
    const teaser = Teasers.findDoc(Template.currentData().updateID.get());
    return Slugs.findDoc(teaser.slugID).name;
  },
  interests() {
    return Interests.find({}, { sort: { name: 1 } });
  },
  selectedInterestIDs() {
    const teaser = Teasers.findDoc(Template.currentData().updateID.get());
    return teaser.interestIDs;
  },
  opportunity() {
    const teaser = Teasers.findDoc(Template.currentData().updateID.get());
    return teaser.opportunityID;
  },
  opportunities() {
    return Opportunities.find().fetch();
  },
});

Template.Update_Teaser_Widget.events({
  submit(event, instance) {
    event.preventDefault();
    const updateData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.reset();
    updateSchema.clean(updateData, { mutate: true });
    instance.context.validate(updateData);
    if (instance.context.isValid()) {
      updateData.id = instance.data.updateID.get();
      updateMethod.call({ collectionName: 'TeaserCollection', updateData }, (error) => {
        if (error) {
          FormUtils.indicateError(instance, error);
        } else {
          FormUtils.indicateSuccess(instance, event);
        }
      });
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
