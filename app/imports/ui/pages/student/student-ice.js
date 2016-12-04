/**
 * Created by ataka on 11/7/16.
 */

Template.Student_Ice.onRendered(function enableAccordian() {
  this.$('.accordion').accordion({
    selector: {
      trigger: '.title .icon'
    }
  })

});
