import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';

function getTeaserURL() {
  const current = FlowRouter.current();
  const path = current.path;
  const lastIndex = path.lastIndexOf('/') + 1;
  const targetSlug = path.substring(lastIndex);
  const targetSlugID = Slugs.findDoc({ name: targetSlug })._id;
  const teaser = Teasers.findNonRetired({ targetSlugID });
  // console.log(targetSlug, teaser);
  return teaser && teaser[0] && teaser[0].url;
}
Template.Teaser_Widget.onCreated(function teaserWidgetOnCreated() {
  setTimeout(() => {
    $('.ui.embed.teaser').embed({
      source: 'youtube',
      id: getTeaserURL(),
    });
  }, 300);
});

Template.Teaser_Widget.helpers({
  updateTeaser() {
    getTeaserURL();
    $('.ui.embed.teaser').embed('destroy');
    $('.ui.embed').embed('change', 'youtube', getTeaserURL());
  },
});
