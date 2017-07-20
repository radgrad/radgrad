import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

/* global cloudinary */

Template.Picture_Form_Field.events({
  'click #image-upload-widget': function click(event) {
    event.preventDefault();
    cloudinary.openUploadWidget(
      {
        cloud_name: Meteor.settings.public.cloudinary.cloud_name,
        upload_preset: Meteor.settings.public.cloudinary.upload_preset,
        sources: ['local', 'url', 'camera'],
        cropping: 'server',
        cropping_aspect_ratio: 1,
        max_file_size: '500000',
        max_image_width: '500',
        max_image_height: '500',
        min_image_width: '300',
        min_image_height: '300',
      },
      (error, result) => {
        if (error) {
          console.log('Error during image upload: ', error);
          return;
        }
        // Otherwise get the form elements
        // console.log('Cloudinary results: ', result);
        const url = result[0].url;
        $("input[name='picture']").val(url);
      });
  },
});
