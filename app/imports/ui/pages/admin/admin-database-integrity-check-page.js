import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { checkIntegrity } from '../../../api/integrity/IntegrityChecker';

const clientDataKey = 'client';
const serverDataKey = 'server';

Template.Admin_DataBase_Integrity_Check_Page.onCreated(function onCreated() {
  this.results = new ReactiveDict();
});

Template.Admin_DataBase_Integrity_Check_Page.helpers({
  hidden(side) {
    const key = (side === 'client') ? clientDataKey : serverDataKey;
    const data = Template.instance().results.get(key);
    return (data) ? '' : 'hidden';
  },
  results(side) {
    const key = (side === 'client') ? clientDataKey : serverDataKey;
    const data = Template.instance().results.get(key);
    return (data) ? data.message : '';
  },
  successOrError(side) {
    const key = (side === 'client') ? clientDataKey : serverDataKey;
    const data = Template.instance().results.get(key);
    return (data && data.count === 0) ? 'success' : 'error';
  },
});

Template.Admin_DataBase_Integrity_Check_Page.events({
  'click .jsIntegrityCheck': function clickJSIntegrityCheck(event, instance) {
    event.preventDefault();
    Meteor.call('IntegrityCheck', null, (error, result) => {
      if (error) {
        console.log('Error during integrity check: ', error);
      } else {
        instance.results.set(serverDataKey, result);
      }
    });
    instance.results.set(clientDataKey, checkIntegrity());
  },
});
