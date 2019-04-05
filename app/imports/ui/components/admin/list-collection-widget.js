import { Template } from 'meteor/templating';

Template.List_Collection_Widget.onCreated(function listCollectionWidgetOnCreated() {
  this.collection = this.data.collection; // subclass of BaseCollection
  this.title = this.data.title; // the title normally all caps
  this.showItemCount = this.data.showItemCount; // ReactiveVar
  this.showItemIndex = this.data.showItemIndex; // ReactiveVar
  this.name = this.data.name; // function given an item to return the name
  this.descriptionPairs = this.data.descriptionPairs; // function given an item returns array of description pairs
  this.additionalTitleInfo = this.data.additionalTitleInfo; // function given an item return additional title info
});

Template.List_Collection_Widget.helpers({
  additionalTitleInfo(item) {
    return Template.instance().additionalTitleInfo(item);
  },
  count() {
    return Template.instance().collection.count();
  },
  descriptionPairs(item) {
    return Template.instance().descriptionNames(item);
  },
  getCollection() {
    return Template.instance().collection;
  },
  getItemCount() {
    return Template.instance().showItemCount;
  },
  getItemIndex() {
    return Template.instance().showItemIndex;
  },
  items() {
    return Template.instance().collection.find().fetch();
  },
  name(item) {
    return Template.instance().name(item);
  },
  title() {
    return Template.instance().title;
  },
});

Template.List_Collection_Widget.events({
  // add your events here
});

Template.List_Collection_Widget.onRendered(function listCollectionWidgetOnRendered() {
  // add your statement here
});

Template.List_Collection_Widget.onDestroyed(function listCollectionWidgetOnDestroyed() {
  // add your statement here
});

