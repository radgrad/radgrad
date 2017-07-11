import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';

function teaserUrlHelper(opportunitySlug) {
  const opportunityID = Slugs.getEntityID(opportunitySlug, 'Opportunity');
  const oppTeaser = Teasers.find({ opportunityID }).fetch();
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
}

Template.Student_Explorer_Opportunities_Widget_Teaser.onCreated(function studentExplorerOpportunitiesWidgetTeaser() {
  setTimeout(() => {
    $('.ui.embed.teaser').embed({
      source: 'youtube',
      id: teaserUrlHelper(FlowRouter.getParam('opportunity')),
    });
  }, 300);
});

Template.Student_Explorer_Opportunities_Widget_Teaser.helpers({
  updateTeaser() {
    $('.ui.embed.teaser').embed('destroy');
    $('.ui.embed').embed('change', 'youtube', teaserUrlHelper(FlowRouter.getParam('opportunity')));
  },
});
