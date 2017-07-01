import { Template } from 'meteor/templating';

// /** @module ui/components/shared/ICE_Header */

Template.ICE_header.helpers({
  i(ice) {
    if (ice) {
      return ice.i;
    }
    return null;
  },
  c(ice) {
    if (ice) {
      return ice.c;
    }
    return null;
  },
  e(ice) {
    if (ice) {
      return ice.e;
    }
    return null;
  },
});
