import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { isLabel } from '../../utilities/template-helpers';
import { Teasers } from '../../../api/teaser/TeaserCollection';

Template.Landing_Explorer_Opportunities_Widget.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.updated = new ReactiveVar(false);
});

Template.Landing_Explorer_Opportunities_Widget.helpers({
  replaceSemString(array) {
    const semString = array.join(', ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  hasTeaser(opportunity) {
    const teaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
    return teaser.length > 0;
  },
  isLabel,
  toUpper(string) {
    if (string) {
      return string.toUpperCase();
    }
    return '';
  },
  updatedTeaser(teaser) {
    return teaser;
  },
});

Template.Landing_Explorer_Opportunities_Widget.onRendered(function enableVideo() {
  setTimeout(function () {
    this.$('.ui.embed').embed();
  }, 300);
  const template = this;
  template.$('.chooseSemester')
      .popup({
        on: 'click',
      });
});
