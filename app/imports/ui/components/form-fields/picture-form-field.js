import { Template } from 'meteor/templating';
import { openCloudinaryWidget } from './open-cloudinary-widget';

Template.Picture_Form_Field.events({
  'click #image-upload-widget': function click(event) {
    event.preventDefault();
    openCloudinaryWidget('picture');
  },
});
