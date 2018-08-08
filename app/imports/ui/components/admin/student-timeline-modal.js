import { Template } from 'meteor/templating';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { Users } from '../../../api/user/UserCollection';

Template.Student_Timeline_Modal.onCreated(function studentTimelineModalOnCreated() {
});

Template.Student_Timeline_Modal.helpers({
  name(user) {
    if (_.isEmpty(user)) {
      return '';
    }
    return Users.getFullName(user.username);
  },
  sessions(user) {
    const sessions = [];
    let currentIndex = 0;
    _.each(user.interactions, function (interaction, index, interactions) {
      if (index !== 0) {
        const prevTimestamp = moment(new Date(interactions[index - 1].timestamp));
        const timestamp = moment(new Date(interaction.timestamp));
        const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
        if (difference >= 5) {
          sessions.push(_.slice(interactions, currentIndex, index));
          currentIndex = index;
        }
      }
    });
    if (sessions.length === 0) {
      sessions.push(user.interactions);
    }
    return sessions;
  },
  sessionDay(session) {
    return moment(session[0].timestamp).utc().format('MMMM Do');
  },
  sessionTime(session) {
    return moment(session[0].timestamp).utc().format('h:mm');
  },
  sessionDuration(session) {
    const firstTimestamp = moment(session[0].timestamp);
    const lastTimestamp = moment(session[session.length - 1].timestamp);
    return moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes().toFixed(2);
  },
});
