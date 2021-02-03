const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

let radgradDump;

const getCollectionData = (collectionName) => _.find(radgradDump.collections, (c) => c.name === collectionName).contents;

const getUserProfile = (username) => {
  const studentProfiles = getCollectionData('StudentProfileCollection');
  return _.find(studentProfiles, (p) => p.username === username);
};

const getRegisteredStudentUsernames = () => {
  const studentProfiles = getCollectionData('StudentProfileCollection');
  const students = _.filter(studentProfiles, (p) => p.isAlumni === false);
  return _.map(students, (s) => s.username);
};

const getFullName = (username) => {
  const profile = getUserProfile(username);
  if (profile) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return '';
};

const getIceSnapshot = (profile) => {
  const iceSnapshots = getCollectionData('IceSnapshotCollection');
  const ice = _.find(iceSnapshots.contents, (i) => i.username === profile.username);
  return ice;
};

const getStudentIce = (username) => {
  const iceSnapshots = getCollectionData('IceSnapshotCollection');
  const ice = _.find(iceSnapshots, (i) => i.username === username);
  return ice;
};

const getUserInteractions = () => {
  const userInteractionCollection = _.find(radgradDump.collections, (c) => c.name === 'UserInteractionCollection').contents;
  return userInteractionCollection;
};

const getUserInteractionsBetween = (startStr, endStr) => {
  const start = moment(startStr);
  const end = moment(endStr);
  const logins = getUserInteractions();
  const between = _.filter(logins, (l) => {
    const lTime = moment(l.timestamp);
    return lTime.isBetween(start, end, null, '[]');
  });
  return _.sortBy(between, (i) => i.timestamp);
};

const getActiveStudentsBetween = (startStr, endStr) => {
  const interactions = getUserInteractionsBetween(startStr, endStr);
  let users = _.map(interactions, (i) => i.username);
  users = _.uniq(users);
  return _.filter(users, (u) => u.username !== 'radgrad@hawaii.edu');
};

const getActiveStudentNamesBetween = (startStr, endStr) => {
  const activeStudents = getActiveStudentsBetween(startStr, endStr);
  // console.log(activeStudents);
  const names = _.map(activeStudents, (u) => {
    // console.log(u, getFullName(u));
    let ice = getStudentIce(u);
    if (_.isUndefined(ice)) {
      ice = {};
      ice.i = 0;
      ice.c = 0;
      ice.e = 0;
    }
    // console.log(ice);
    return `${getFullName(u)}: ${getUserLoginsBetween(u, startStr, endStr).length} [${ice.i}, ${ice.c}, ${ice.e}]`;
  });
  // console.log(names);
  return names;
};

const getInteractionsPerUser = (username) => {
  const interactions = getUserInteractions();
  return _.filter(interactions, (i) => i.username === username);
};

const getInteractionsPerUserBetween = (username, startStr, endStr) => {
  const interactions = getUserInteractionsBetween(startStr, endStr);
  return _.filter(interactions, (i) => i.username === username);
};

const getInteractionsByType = (type) => {
  const interactions = getUserInteractions();
  return _.filter(interactions, (i) => i.type === type);
};

const getInteractionsByTypeBetween = (type, startStr, endStr) => {
  const start = moment(startStr);
  const end = moment(endStr);
  const interactions = getInteractionsByType(type);
  const between = _.filter(interactions, (l) => {
    const lTime = moment(l.timestamp);
    return lTime.isBetween(start, end, null, '[]');
  });
  return between;
};

const getLoginInteractions = () => {
  return getInteractionsByType('login');
};

const getLoginsBetween = (startStr, endStr) => {
  const start = moment(startStr);
  const end = moment(endStr);
  const logins = getLoginInteractions();
  const between = _.filter(logins, (l) => {
    const lTime = moment(l.timestamp);
    return lTime.isBetween(start, end, null, '[]');
  });
  return between;
};

const getLoginsBetweenWoRadgrad = (startStr, endStr) => {
  const logins = getLoginsBetween(startStr, endStr);
  return _.filter(logins, (l) => l.username !== 'radgrad@hawaii.edu');
};

const getUserLogins = (profile) => {
  const logins = getLoginInteractions();
  const userLogins = _.filter(logins, (l) => l.username === profile.username);
  return userLogins;
};

const getUniqLoginsBetween = (startStr, endStr) => {
  const logins = getLoginsBetween(startStr, endStr);
  return _.uniqBy(logins, (l) => l.username);
};

const getUniqLoginsBetweenWoRadgrad = (startStr, endStr) => {
  const logins = getUniqLoginsBetween(startStr, endStr);
  return _.filter(logins, (l) => l.username !== 'radgrad@hawaii.edu');
};

const getUserLoginsBetween = (username, startStr, endStr) => {
  const logins = getLoginsBetween(startStr, endStr);
  return _.filter(logins, (l) => l.username === username);
};

const loginAnalysis = (startString, endString) => {
  const uniqLogins = getUniqLoginsBetween(startString, endString);
  // console.log(uniqLogins);
  let min = 1000;
  let max = 0;
  let sum = 0;
  let mostLogins;
  _.forEach(uniqLogins, (l) => {
    if (l.username !== 'radgrad@hawaii.edu') {
      const userLogins = getUserLoginsBetween(l.username, startString, endString);
      const { length } = userLogins;
      if (min > length) {
        min = length;
      }
      if (max < length) {
        max = length;
        mostLogins = l.username;
      }
      sum += length;
    }
  });
  console.log('User logins min=%o max=%o sum=%o user with most %o', min, max, sum, mostLogins);
};

const userAnalysis = (username, startString, endString) => {
  let results = getFullName(username);
  results = `${results}, ${getUserLoginsBetween(username, startString, endString).length}`;
  return results;
};

const sessionInformation = (username, startStr, endStr, consolep) => {
  const interactions = getInteractionsPerUserBetween(username, startStr, endStr);
  // if (consolep) {
  //   console.log(username, startStr, endStr, interactions.length);
  // }
  let sessions = 0;
  const sessionLength = [];
  let lastTimeStamp;
  let sessionStart;
  let sessionEnd;
  _.forEach(interactions, (i) => {
    if (_.isUndefined(lastTimeStamp)) {
      if (consolep) {
        console.log('init', i.timestamp);
      }
      lastTimeStamp = moment(i.timestamp);
      sessionStart = lastTimeStamp;
      sessionEnd = sessionStart;
    } else {
      // if (consolep) {
      //   console.log('next', sessionStart.format(), i.timestamp);
      // }
      const currentTimestamp = moment(i.timestamp);
      if (currentTimestamp.diff(lastTimeStamp, 'hours', true) > 1) {
        if (consolep) {
          console.log('new session', sessionStart.format(),
            sessionEnd.format(), sessionEnd.diff(sessionStart, 'minutes'));
        }
        sessions++;
        sessionLength.push(sessionEnd.diff(sessionStart, 'minutes'));
        sessionStart = currentTimestamp;
        sessionEnd = currentTimestamp;
      } else {
        sessionEnd = currentTimestamp;
      }
      lastTimeStamp = currentTimestamp;
    }
  });
  if (sessionLength.length === 0 && sessionEnd && sessionStart) { // only one session
    sessionLength.push(sessionEnd.diff(sessionStart, 'minutes'));
  }
  let totalSessionTime = 0;
  if (sessionLength.length > 0) {
    totalSessionTime = sessionLength.reduce((total, num) => total + num);
    const retVal = {};
    retVal.username = username;
    retVal.sessionCount = sessions;
    retVal.sessionLength = sessionLength;
    retVal.shortestSession = Math.min(...sessionLength);
    retVal.longestSession = Math.max(...sessionLength);
    retVal.totalSessionTime = totalSessionTime;
    retVal.averageSession = totalSessionTime / sessions;
    // if (consolep) {
    //   console.log(retVal);
    // }
    return retVal;
  }
  // console.log(totalSessionTime);
  const retVal = {};
  retVal.username = username;
  retVal.sessionCount = 0;
  retVal.sessionLength = 0;
  retVal.shortestSession = 0;
  retVal.longestSession = 0;
  retVal.totalSessionTime = 0;
  retVal.averageSession = 0;
  return retVal;
};

const studentSessionInformationBetween = (startStr, endStr, progressp = true, consolep) => {
  const usernames = getActiveStudentsBetween(startStr, endStr);
  const results = [];
  _.forEach(usernames, (username, index) => {
    results.push(sessionInformation(username, startStr, endStr, consolep));
    if (index % 10 === 0 && progressp) {
      console.log(`working ${((index / usernames.length) * 100).toFixed(2)} %`);
    }
  });
  return results;
};

const studentSessionInformationToCSV = (data) => {
  let resultStr = 'Student, Session Count, Session Lengths, Shortest, Longest, Total Time, Average\n';
  _.forEach(data, (d) => {
    if (d.sessionCount > 0) {
      resultStr = `${resultStr}${d.username},${d.sessionCount},${d.sessionLength.join(' ')},${d.shortestSession},${d.longestSession},${d.totalSessionTime},${d.averageSession}\n`;
    } else {
      resultStr = `${resultStr}${d.username},0,0,0,0,0,0\n`;
    }
  });
  return resultStr;
};

const sessionInformationBetween = (startStr, endStr, consolep) => {
  const usernames = getActiveStudentsBetween(startStr, endStr);
  // console.log(usernames);
  let sessions = 0;
  let sessionTime = 0;
  let lastTimeStamp;
  let sessionStart;
  let sessionEnd;
  let minSessions = 1000;
  let maxSessions = 0;
  _.forEach(usernames, (username, index) => {
    const sessionInfo = sessionInformation(username, startStr, endStr, consolep);
    sessions += sessionInfo.sessionCount;
    sessionTime += sessionInfo.totalSessionTime;
    if (minSessions > sessionInfo.sessionCount) {
      minSessions = sessionInfo.sessionCount;
    }
    if (maxSessions < sessionInfo.sessionCount) {
      maxSessions = sessionInfo.sessionCount;
    }
    if (index % 10 === 0 && consolep) {
      console.log('working %o %', ((index / usernames.length) * 100).toFixed(2));
    }
  });
  const retVal = {};
  retVal.sessionCount = sessions;
  retVal.minSessions = minSessions;
  retVal.maxSessions = maxSessions;
  retVal.totalSessionTime = sessionTime;
  retVal.averageSessionTime = sessionTime / sessions;
  return retVal;
};


const pageViewsBetween = (startStr, endStr) => {
  const pageViews = getInteractionsByTypeBetween('pageView', startStr, endStr);
  const pageViewsByPage = _.groupBy(pageViews, (p) => p.typeData[0]);
  return _.mapValues(pageViewsByPage, (value) => value.length);
};

const coursePageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('courses'));
};

const opportunityPageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('opportunities'));
};

const degreePlanPageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('degree'));
};

const explorerPageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('explorer'));
};

const initDataDump = () => {
  const { argv } = process;
  // console.log(argv);
  if (argv.length < 3) {
    console.error('Usage: node analyze-data-dump.js <fileName>');
  } else {
    const filename = argv[2];
    const data = fs.readFileSync(filename);
    radgradDump = JSON.parse(data.toString());
  }
};

const opportunityICE = () => {
  const opportunities = getCollectionData('OpportunityCollection');
  const info = _.map(opportunities, (o) => {
    if (o.retired) {
      return `${o.name}: [${o.ice.i}, ${o.ice.c}, ${o.ice.e}] Retired`;
    }
    return `${o.name}: [${o.ice.i}, ${o.ice.c}, ${o.ice.e}]`;
  });
  return info;
};

const analyzeData = () => {
  initDataDump();
  // console.log('# Registered students: %o', getRegisteredStudentUsernames().length);
  // console.log('# Active students Spring 20: %o', getActiveStudentsBetween('2020-01-01', '2020-05-31').length);
  // console.log('# Active students Fall 20: %o', getActiveStudentsBetween('2020-08-01', '2020-12-31').length);
  // const names = getActiveStudentNamesBetween('2020-01-01', '2020-05-31');
  // const names = getActiveStudentNamesBetween('2020-08-01', '2020-12-31');
  // console.log(names.join(', '));
  // loginAnalysis('2020-01-01', '2020-05-31');
  // loginAnalysis('2020-08-01', '2020-12-31');
  // console.log(sessionInformationBetween('2020-01-01', '2020-05-31', false));
  // console.log(sessionInformationBetween('2020-08-01', '2020-12-31', false));
  // console.log(studentSessionInformationBetween('2019-01-01', '2019-05-31', false, false));
  console.log(studentSessionInformationBetween('2019-08-01', '2019-12-31', true, false));
  // console.log(studentSessionInformationToCSV(studentSessionInformationBetween('2019-01-01', '2019-05-31', false)));
  // console.log(pageViewsBetween('2019-01-01', '2019-05-31'));
  // const oICE = opportunityICE();
  // console.log(oICE.slice(oICE.length - 10, oICE.length));
  // console.log(sessionInformation('gcalica@hawaii.edu', '2020-01-01', '2020-05-31', true));
};

analyzeData();
