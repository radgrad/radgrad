import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Users } from '../../../api/user/UserCollection.js';
import { Feeds } from '../../../api/feed/FeedCollection.js';


Template.Student_Selector_Widget.helpers({
});

Template.Student_Selector_Widget.events({
});

Template.Student_Selector_Widget.onCreated(function studentSelectorOnCreated() {
  if (this.data.dictionary) {
    this.state = this.data.dictionary;
  } else {
    this.state = new ReactiveDict();
  }
  if (this.data.studentID) {
    this.studentID = this.data.studentID;
  }
  this.subscribe(Feeds.getPublicationName());
  this.subscribe(Users.getPublicationName());
});

Template.Student_Selector_Widget.onRendered(function studentSelectorOnRendered() {
});

Template.Student_Selector_Widget.onDestroyed(function studentSelectorOnDestroyed() {
  // add your statement here
});
