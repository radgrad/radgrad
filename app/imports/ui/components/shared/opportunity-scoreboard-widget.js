import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';

import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityScoreboard } from '../../../startup/client/collections';
import { Semesters } from '../../../api/semester/SemesterCollection';

Template.Opportunity_Scoreboard_Widget.onCreated(function opportunityScoreboardWidgetOnCreated() {
  this.saveWorking = new ReactiveVar();
  this.results = new ReactiveVar();
  this.successOrError = new ReactiveVar();
});

Template.Opportunity_Scoreboard_Widget.helpers({
  opportunities() {
    return Opportunities.findNonRetired({}, { sort: { name: 1 } });
  },
  errorMessage() {
    return Template.instance()
      .successOrError
      .get() === 'error' ? Template.instance()
      .results
      .get() : '';
  },
  highlight(course, semester) {
    const id = `${course._id} ${semester._id}`;
    const scoreItem = OpportunityScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count > 0;
    }
    return false;
  },
  important(course, semester) {
    const id = `${course._id} ${semester._id}`;
    const scoreItem = OpportunityScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count > 10;
    }
    return false;
  },
  hidden() {
    const data = Template.instance()
      .results
      .get();
    return (data) ? '' : 'hidden';
  },
  opportunityName(opportunity) {
    return opportunity.name;
  },
  results() {
    return Template.instance()
      .results
      .get() || '';
  },
  successOrError() {
    return Template.instance()
      .successOrError
      .get();
  },
  semesters() {
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const start = currentSemester.semesterNumber;
    const end = start + 9;
    return Semesters.findNonRetired({ semesterNumber: { $gte: start, $lt: end } },
      { sort: { semesterNumber: 1 } });
  },
  semesterName(semester) {
    return Semesters.getShortName(semester._id);
  },
  semesterScore(course, semester) {
    const id = `${course._id} ${semester._id}`;
    const scoreItem = OpportunityScoreboard.findOne({ _id: id });
    if (scoreItem) {
      return scoreItem.count;
    }
    return 0;
  },
  saveWorking() {
    return Template.instance()
      .saveWorking
      .get();
  },
});

// Must match the format in the server-side startup/server/fixtures.js
export const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

Template.Opportunity_Scoreboard_Widget.events({
  'click .jsSaveOppCSV': function clickSaveCSV(event, instance) {
    event.preventDefault();
    instance.saveWorking.set(true);
    const currentSemester = Semesters.getCurrentSemesterDoc();
    const start = currentSemester.semesterNumber;
    const end = start + 9;
    const semesters = Semesters.findNonRetired({ semesterNumber: { $gte: start, $lt: end } },
      { sort: { semesterNumber: 1 } });
    const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
    let result = '';
    const headerArr = ['Opportunity'];
    _.forEach(semesters, (s) => {
      headerArr.push(Semesters.getShortName(s._id));
    });
    result += headerArr.join(',');
    result += '\r\n';
    _.forEach(opportunities, (c) => {
      result += `${c.name},`;
      _.forEach(semesters, (s) => {
        const id = `${c._id} ${s._id}`;
        const scoreItem = OpportunityScoreboard.findOne({ _id: id });
        result += scoreItem ? `${scoreItem.count},` : '0,';
      });
      result += '\r\n';
    });
    console.log(result);
    instance.results.set(result);
    instance.successOrError.set('success');
    const zip = new ZipZap();
    const dir = 'opportuntity-scoreboard';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
    zip.file(fileName, result);
    zip.saveAs(`${dir}.zip`);
    instance.saveWorking.set(false);
  },
});

Template.Opportunity_Scoreboard_Widget.onRendered(function opportunityScoreboardWidgetOnRendered() {
  // add your statement here
});

Template.Opportunity_Scoreboard_Widget.onDestroyed(function opportunityScoreboardWidgetOnDestroyed() {
  // add your statement here
});

