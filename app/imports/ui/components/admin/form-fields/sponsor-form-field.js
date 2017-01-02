import { Template } from 'meteor/templating';

Template.Sponsor_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Sponsor_Form_Field.helpers({
  isSelected(sponsor, selectedSponsor) {
    console.log('isSelected sponsor', sponsor, selectedSponsor);
    return sponsor === selectedSponsor;
  },
  sponsorName(sponsor) {
    return `${sponsor.firstName} ${sponsor.lastName}`;
  },
});
