import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { isLabel } from '../../utilities/template-helpers';

Template.Landing_Explorer_Opportunities_Widget.onCreated(function studentExplorerOpportunitiesWidgetOnCreated() {
  this.updated = new ReactiveVar(false);
});

Template.Landing_Explorer_Opportunities_Widget.helpers({
  replaceSemString(array) {
    const semString = array.join(', ');
    return semString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  },
  isLabel,
  toUpper(string) {
    return string.toUpperCase();
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
