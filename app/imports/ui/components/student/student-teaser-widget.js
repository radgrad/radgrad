import { Template } from 'meteor/templating';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { Interests } from '../../../api/interest/InterestCollection.js';

Template.Student_Teaser_Widget.onCreated(function appBodyOnCreated() {
  this.subscribe(Teasers.getPublicationName());
  this.subscribe(Interests.getPublicationName());
});

Template.Student_Teaser_Widget.helpers({
  getDictionary() {
    return Template.instance().state;
  },
  getTeasers() {
    return Teasers.find().fetch();
  },
  getTeaserInterests(teaser) {
    return Interests.findNames(teaser.interestIDs);
  },
});

Template.Student_Teaser_Widget.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Student_Teaser_Widget.onRendered(function enableVideo() {
  setTimeout(() => {
    this.$('.ui.embed').embed();
  }, 200);
});
