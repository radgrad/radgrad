import { Template } from 'meteor/templating';
import { Users } from '../../../../api/user/UserCollection';

Template.Sponsor_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

Template.Sponsor_Form_Field.helpers({
  isSelected(sponsor, selectedSponsor) {
    return sponsor === selectedSponsor;
  },
  sponsorName(sponsor) {
    return Users.getFullName(sponsor.username);
  },
});
