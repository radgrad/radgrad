import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';

function teaserUrlHelper(opportunitySlug) {
  const opportunityID = Slugs.getEntityID(opportunitySlug, 'Opportunity');
  const oppTeaser = Teasers.find({ opportunityID }).fetch();
  return oppTeaser[0].url;
}

Template.Student_Explorer_Opportunities_Widget_Teaser.onRendered(function enableVideo() {

});

Template.Student_Explorer_Opportunities_Widget_Teaser.helpers({
  updateTeaser() {
    $('.ui.embed.teaser').embed('destroy');
    $('.ui.embed').embed('change', 'youtube', teaserUrlHelper(FlowRouter.getParam('opportunity')));
  },
});

Template.Student_Explorer_Opportunities_Widget_Teaser.onCreated(function studentExplorerOpportunitiesWidgetTeaser() {
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Teasers.getPublicationName());
  setTimeout(() => {
    $('.ui.embed.teaser').embed({
      source: 'youtube',
      id: teaserUrlHelper(FlowRouter.getParam('opportunity')),
    });
  }, 300);
});
