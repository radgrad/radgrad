import { Template } from 'meteor/templating';

// /** @module ui/components/shared/Back_To_Top_Button */

Template.Back_To_Top_Button.onRendered(function backToTopButtonOnRendered() {
  // add your statement here
  const offset = 250;
  const duration = 300;

  $(window).scroll(function windowScrollTop() { // eslint-disable-line
    if (this.$(this).scrollTop() > offset) {
      this.$('#back-to-top').fadeIn(duration);
    } else {
      this.$('#back-to-top').fadeOut(duration);
    }
  });

  this.$('#back-to-top').click(function buttonAnimate(event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, duration); // eslint-disable-line
    return false;
  });
});
