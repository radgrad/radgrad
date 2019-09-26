import { Template } from 'meteor/templating';
import { Feeds } from '../../../api/feed/FeedCollection';

Template.Student_Feed_Widget.helpers({
  feeds() {
    // console.log(Feeds.findNonRetired({}, { sort: { timestamp: -1 } }));
    return Feeds.findNonRetired({}, { sort: { timestamp: -1 } });
  },
});
