import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Slugs } from '../../../api/slug/SlugCollection.js';
import { Teasers } from '../../../api/teaser/TeaserCollection.js';
import { ReactiveVar } from 'meteor/reactive-var';

function teaserUrlHelper(opportunitySlug) {
  //const opportunitySlug = FlowRouter.getParam('opportunity');
  const opportunityID = Slugs.getEntityID(opportunitySlug, 'Opportunity');
  const oppTeaser = Teasers.find({ opportunityID }).fetch();
  console.log(oppTeaser[0].url);
  return oppTeaser[0].url;
}

Template.Student_Explorer_Opportunities_Widget_Teaser.onRendered(function enableVideo() {

});

Template.Student_Explorer_Opportunities_Widget_Teaser.helpers({
  teaserUrl() {
    return teaserUrlHelper();
  },
  testing() {
    console.log("Changed?" + FlowRouter.getParam('opportunity'));
    $('.ui.embed.teaser').embed('destroy');
    $('.ui.embed').embed('change', 'youtube', teaserUrlHelper(FlowRouter.getParam('opportunity'), `//www.youtube/com/embed/${teaserUrlHelper(FlowRouter.getParam('opportunity'))}`));

  },
});

Template.Student_Explorer_Opportunities_Widget_Teaser.onCreated(function studentExplorerOpportunitiesWidgetTeaser() {
  this.subscribe(Slugs.getPublicationName());
  this.subscribe(Teasers.getPublicationName());
  this.currentItem = () => FlowRouter.getParam('opportunity');
  //this.currentItem = new ReactiveVar(FlowRouter.getParam('opportunity'));

  this.autorun(() => {
    console.log("hello oncreated is running");
  setTimeout(() => {
    $('.ui.embed.teaser').embed({
    source: 'youtube',
    id: teaserUrlHelper(FlowRouter.getParam('opportunity')),
  });
}, 300);
  });
});
