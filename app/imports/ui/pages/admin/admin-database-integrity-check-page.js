import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { checkIntegrity } from '../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../api/integrity/IntegrityChecker.methods';

const clientDataKey = 'client';
const serverDataKey = 'server';

Template.Admin_DataBase_Integrity_Check_Page.onCreated(function onCreated() {
  this.results = new ReactiveDict();
  this.working = new ReactiveVar(false);
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
  working() {
    return Template.instance().working.get();
  },
});

Template.Admin_DataBase_Integrity_Check_Page.events({
  'click .jsIntegrityCheck': function clickJSIntegrityCheck(event, instance) {
    instance.working.set(true);
    event.preventDefault();
    checkIntegrityMethod.call(null, (error, result) => {
      if (error) {
        console.log('Error during integrity check: ', error);
      } else {
        instance.results.set(serverDataKey, result);
      }
      instance.working.set(false);
    });
    instance.results.set(clientDataKey, checkIntegrity());
  },
});
