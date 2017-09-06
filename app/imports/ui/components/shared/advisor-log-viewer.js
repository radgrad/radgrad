import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';

Template.Advisor_Log_Viewer.helpers({
  logs() {
    return AdvisorLogs.find();
  },
  logDate(log) {
    const m = moment(log.createdOn);
    return m.format('MM/DD/YY');
  },
  logAdvisorName(log) {
    const advisor = AdvisorLogs.getAdvisorDoc(log.advisorID);
    return `${advisor.firstName} ${advisor.lastName}`;
  },
});
