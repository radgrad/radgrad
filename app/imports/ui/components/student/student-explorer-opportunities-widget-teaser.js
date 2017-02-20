import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';


Template.Student_Explorer_Opportunities_Widget_Teaser.onRendered(function enableVideo() {
  this.autorun(() => {
    setTimeout(() => {
      this.$('.ui.embed').embed();
    }, 300);
  });
});

Template.Student_Explorer_Opportunities_Widget_Teaser.helpers({
  teaserUrl() {
    const opportunitySlug = FlowRouter.getParam('opportunity');
    console.log(opportunitySlug);
    const opportunityID = Slugs.getEntityID(opportunitySlug, 'Opportunity');
    const oppTeaser = Teasers.find({ opportunityID }).fetch();
    return oppTeaser[0].url;
  },
});
