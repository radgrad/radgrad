import { Template } from 'meteor/templating';

function getRandomIntInclusive(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

Template.Opportunity_Item.helpers({
  iceI(opportunity) {
    return opportunity.ice.i;
  },
  iceC(opportunity) {
    return opportunity.ice.c;
  },
  iceE(opportunity) {
    return opportunity.ice.e;
  },
  recommendationStars(opportunity) {
    const numStars = getRandomIntInclusive(1, 5);
    let i;
    const retVal = [];
    for (i = 0; i < numStars; i += 1) {
      retVal.push(`${i}`);
    }
    return retVal;
  },
});

Template.Opportunity_Item.events({
  // add your events here
});

Template.Opportunity_Item.onCreated(function () {
  // add your statement here
});

Template.Opportunity_Item.onRendered(function () {
  this.$('.ui.accordion').accordion();
});

Template.Opportunity_Item.onDestroyed(function () {
  // add your statement here
});

