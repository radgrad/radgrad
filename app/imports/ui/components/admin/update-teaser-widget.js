import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Interests } from '../../../api/interest/InterestCollection.js';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection.js';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import * as FormUtils from './form-fields/form-field-utilities.js';

const updateSchema = new SimpleSchema({
  title: { type: String, optional: false },
  author: { type: String, optional: false },
  url: { type: String, optional: false },
  description: { type: String, optional: false },
  duration: { type: String, optional: false },
  interests: { type: [String], optional: false, minCount: 1 },
  opportunity: { type: String, optional: true },
});

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
    const updatedData = FormUtils.getSchemaDataFromEvent(updateSchema, event);
    instance.context.resetValidation();
    updateSchema.clean(updatedData);
    instance.context.validate(updatedData);
    if (instance.context.isValid()) {
      FormUtils.renameKey(updatedData, 'interests', 'interestIDs');
      FormUtils.renameKey(updatedData, 'opportunity', 'opportunityID');
      Teasers.update(instance.data.updateID.get(), { $set: updatedData });
      FormUtils.indicateSuccess(instance, event);
    } else {
      FormUtils.indicateError(instance);
    }
  },
  'click .jsCancel': FormUtils.processCancelButtonClick,
});
