const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

let radgradDump;

const getCollectionData = (collectionName) => {
  return _.find(radgradDump.collections, (c) => c.name === collectionName).contents;
}

const getUserProfile = (username) => {
  const studentProfiles = getCollectionData('StudentProfileCollection');
  return _.find(studentProfiles, (p) => p.username === username);
}

const getFullName = (username) => {
  const profile = getUserProfile(username);
  return `${profile.firstName} ${profile.lastName}`;
}

const getIceSnapshot = (profile) => {
  const iceSnapshots = _.find(radgradDump.collections, (c) => c.name === 'IceSnapshotCollection');
  const ice = _.find(iceSnapshots.contents, (i) => i.username === profile.username);
  return ice;
}

const getUserInteractions = () => {
  const userInteractionCollection = _.find(radgradDump.collections, (c) => c.name === 'UserInteractionCollection').contents;
  return userInteractionCollection;
}

const getUserInteractionsBetween = (startStr, endStr) => {
  const start = moment(startStr);
  const end = moment(endStr);
  const logins = getUserInteractions();
  const between = _.filter(logins, (l) => {
    const lTime = moment(l.timestamp);
    return lTime.isBetween(start, end, null, '[]');
  });
  return between;
}

const getInteractionsPerUser = (username) => {
  const interactions = getUserInteractions();
  return _.filter(interactions, (i) => i.username === username);
}

const getInteractionsPerUserBetween = (username, startStr, endStr) => {
  const interactions = getUserInteractionsBetween(startStr, endStr)
  return _.filter(interactions, (i) => i.username === username);
}

const getInteractionsByType = (type) => {
  const interactions = getUserInteractions();
  return  _.filter(interactions, (i) => i.type === type);
}

const getInteractionsByTypeBetween = (type, startStr, endStr) => {
  const start = moment(startStr);
  const end = moment(endStr);
  const interactions = getInteractionsByType(type);
  const between = _.filter(interactions, (l) => {
    const lTime = moment(l.timestamp);
    return lTime.isBetween(start, end, null, '[]');
  });
  return between;
}

const getLoginInteractions = () => {
  return getInteractionsByType('login');
}

const getLoginsBetween = (startStr, endStr) => {
  const start = moment(startStr);
  const end = moment(endStr);
  const logins = getLoginInteractions();
  const between = _.filter(logins, (l) => {
    const lTime = moment(l.timestamp);
    return lTime.isBetween(start, end, null, '[]');
  });
  return between;
}

const getLoginsBetweenWoRadgrad = (startStr, endStr) => {
  const logins = getLoginsBetween(startStr, endStr);
  return _.filter(logins, (l) => l.username !== 'radgrad@hawaii.edu');
}

const getUserLogins = (profile) => {
  const logins = getLoginInteractions();
  const userLogins = _.filter(logins, (l) => l.username === profile.username);
  return userLogins;
}

const getUniqLoginsBetween = (startStr, endStr) => {
  const logins = getLoginsBetween(startStr, endStr);
  return _.uniqBy(logins, (l) => l.username);
}

const getUniqLoginsBetweenWoRadgrad = (startStr, endStr) => {
  const logins = getUniqLoginsBetween(startStr, endStr);
  return _.filter(logins, (l) => l.username !== 'radgrad@hawaii.edu');
}

const getUserLoginsBetween = (username, startStr, endStr) => {
  const logins = getLoginsBetween(startStr, endStr);
  return _.filter(logins, (l) => l.username === username);
}

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
      const length = userLogins.length;
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
}

const userAnalysis = (username, startString, endString) => {
  let results = getFullName(username);
  results = `${results}, ${getUserLoginsBetween(username, startString, endString).length}`;
  return results;
}

const sessionInformation = (username, startStr, endStr) => {
  const interactions = getInteractionsPerUserBetween(username, startStr, endStr);
  let sessions = 0;
  const sessionLength = [];
  let lastTimeStamp;
  let sessionStart;
  let sessionEnd;
  _.forEach(interactions, (i) => {
    if (_.isUndefined(lastTimeStamp)) {
      // console.log('init');
      lastTimeStamp = moment(i.timestamp);
      sessionStart = lastTimeStamp;
      sessionEnd = sessionStart;
    } else {
      // console.log('next');
      const currentTimestamp = moment(i.timestamp);
      if (currentTimestamp.diff(lastTimeStamp, 'hours', true) > 1) {
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
  const retVal = {};
  retVal.sessionCount = sessions;
  retVal.sessionLength = sessionLength;
  return retVal;
}

const pageViewsBetween = (startStr, endStr) => {
  const pageViews = getInteractionsByTypeBetween('pageView', startStr, endStr);
  const pageViewsByPage = _.groupBy(pageViews, (p) => p.typeData[0]);
  return _.mapValues(pageViewsByPage, (value) => value.length);
}

const coursePageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('courses'));
}

const opportunityPageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('opportunities'));
}

const degreePlanPageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('degree'));
}

const explorerPageViewsBetween = (startStr, endStr) => {
  const views = pageViewsBetween(startStr, endStr);
  return _.pickBy(views, (value, key) => key.includes('explorer'));
}

const initDataDump = () => {
  const argv = process.argv;
  // console.log(argv);
  if (argv.length < 3) {
    console.error('Usage: node analyze-data-dump.js <fileName>');
  } else {
    const filename = argv[2];
    const data = fs.readFileSync(filename);
    radgradDump = JSON.parse(data.toString());
  }
}



const analyzeData = () => {
  initDataDump();
  // console.log(getLoginsBetween('2019-01-01', '2019-05-31').length);
  // console.log(getLoginsBetweenWoRadgrad('2019-01-01', '2019-05-31').length);
  // console.log(getUniqLoginsBetween('2019-01-01', '2019-05-31').length);
  // console.log(getUniqLoginsBetweenWoRadgrad('2019-01-01', '2019-05-31').length);
  // loginAnalysis('2018-08-01', '2018-12-31');
  // loginAnalysis('2019-01-01', '2019-05-31');
  // console.log('Name, logins');
  // console.log(userAnalysis('mirabela@hawaii.edu', '2019-01-01', '2019-05-31'));
  console.log(sessionInformation('mirabela@hawaii.edu', '2019-01-01', '2019-05-31'));
  console.log(explorerPageViewsBetween('2019-01-01', '2019-05-31'));
}

analyzeData();
