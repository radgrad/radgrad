import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { teasersUpdateMethod } from '../../../api/teaser/TeaserCollection.methods';
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
  duration: String,
  interests: { type: Array, minCount: 1 }, 'interests.$': String,
  opportunity: { type: String, optional: true },
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
      FormUtils.renameKey(updateData, 'interests', 'interestIDs');
      FormUtils.renameKey(updateData, 'opportunity', 'opportunityID');
      updateData.id = instance.data.updateID.get();
      teasersUpdateMethod.call(updateData, (error) => {
        if (error) {
          console.log('Error updating Teaser', error);
          FormUtils.indicateError(instance);
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
