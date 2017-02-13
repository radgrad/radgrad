import { Template } from 'meteor/templating';

Template.Back_To_Top_Button.helpers({
  // add your helpers here
});

Template.Back_To_Top_Button.events({
  // add your events here
});

Template.Back_To_Top_Button.onCreated(function backToTopButtonOnCreated() {
  // add your statement here
});

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

Template.Back_To_Top_Button.onDestroyed(function backToTopButtonOnDestroyed() {
  // add your statement here
});

