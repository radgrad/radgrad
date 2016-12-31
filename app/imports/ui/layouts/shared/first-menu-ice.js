import { Template } from 'meteor/templating';

Template.First_Menu_Ice.helpers({
  pClass(value) {
    return `p${value}`;
  },
});
