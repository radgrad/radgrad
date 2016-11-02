import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Detail_Card.helpers({
  hasCourse() {
    console.log('hasCourse')
    const instance = Template.instance();
    console.log(instance);
    return instance.state.get('course');
  },
});

Template.Detail_Card.events({
  // add your events here
});

Template.Detail_Card.onCreated(function detailCardOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('course', this.data.course);
});

Template.Detail_Card.onRendered(function detailCardOnRendered() {
  console.log(this.data);
  this.state.set('course', this.data.course);
});

Template.Detail_Card.onDestroyed(function () {
  // add your statement here
});

