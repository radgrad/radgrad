import { Template } from 'meteor/templating';

Template.First_Menu_Ice.helpers({
  pClass(value) {
    return (value <= 100) ? `p${value}` : 'p100';
  },
});
