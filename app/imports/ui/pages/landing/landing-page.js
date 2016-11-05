import { Template } from 'meteor/templating';

Template.Landing_Page.onCreated(function appBodyOnCreated() {
  // placeholder: typically you will put global subscriptions here if you remove the autopublish package.
});

Template.Landing_Page.helpers({
  // placeholder: if you display dynamic data in your layout, you will put your template helpers here.
});

Template.Landing_Page.events({
  // placeholder: if you add a form to this top-level layout, handle the associated events here.
});

Template.Landing_Page.onRendered(function enableDropDown() {
  this.$('.menu .item').tab();
  // const interestWords = [
  //   { text: 'Aerospace', weight: 10 },
  //   { text: 'Algorithms', weight: 10 },
  //   { text: 'Android', weight: 15 },
  //   { text: 'Data Science', weight: 8 },
  //   { text: 'Game Design', weight: 18 },
  //   { text: 'Javascript', weight: 22 },
  //   { text: 'Machine Learning', weight: 19 },
  //   { text: 'Software Engineering', weight: 20 },
  //   { text: 'Python', weight: 27 },
  //   { text: 'Security', weight: 21 },
  //   { text: 'Networks', weight: 16 },
  //   { text: 'C++', weight: 22 },
  //   { text: 'Java', weight: 10 },
  // ];
  //
  // this.$('#interests-cloud').jQCloud(interestWords, {
  //   autoResize: true,
  // });
  //
  // const degreegoalWords = [
  //   { text: 'Network designer', weight: 14 },
  //   { text: 'Systems analyst', weight: 17 },
  //   { text: 'Biomedical Engineer', weight: 15 },
  //   { text: 'Data Scientist', weight: 8 },
  //   { text: 'DB Administrator', weight: 6 },
  //   { text: 'Ph.D. student', weight: 12 },
  //   { text: 'Robotics Engineer', weight: 9 },
  //   { text: 'Security Analyst', weight: 10 },
  //   { text: 'UX Designer', weight: 10 },
  // ];
  //
  // this.$('#degreegoals-cloud').jQCloud(degreegoalWords, {
  //   autoResize: true,
  //   removeOverflowing: false,
  // });
});
