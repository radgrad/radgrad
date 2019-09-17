/* global window */
import { moment } from 'meteor/momentjs:moment';

window.camDebugging = {};

window.camDebugging.helperCount = 0;

window.camDebugging.helperCounts = {};

window.camDebugging.earlyTimes = {};

window.camDebugging.lateTimes = {};

window.camDebugging.runTimes = {};

window.camDebugging.startTimes = {};

window.camDebugging.start = function start(name) {
  if (name) {
    // count it.
    if (window.camDebugging.helperCounts[name]) {
      window.camDebugging.helperCounts[name] += 1;
    } else {
      window.camDebugging.helperCounts[name] = 1;
    }
    // early time
    if (window.camDebugging.earlyTimes[name]) {
      if (moment().isBefore(window.camDebugging.earlyTimes[name])) {
        window.camDebugging.earlyTimes[name] = moment();
      }
    } else {
      window.camDebugging.earlyTimes[name] = moment();
    }
    // start time
    window.camDebugging.startTimes[name] = moment();
  }
  window.camDebugging.helperCount += 1;
  if (window.camDebugging.earliest) {
    if (moment().isBefore(window.camDebugging.earliest)) {
      window.camDebugging.earliest = moment();
    }
  } else {
    window.camDebugging.earliest = moment();
  }
};

window.camDebugging.stop = function stop(name) {
  if (name) {
    const stopTime = moment();
    if (window.camDebugging.startTimes[name]) {
      if (window.camDebugging.runTimes[name]) {
        // console.log(moment.utc(stopTime.diff(window.camDebugging.startTimes[name])).format('ss.SSSS'));
        window.camDebugging.runTimes[name] += moment.utc(stopTime.diff(window.camDebugging.startTimes[name]));
      } else {
        window.camDebugging.runTimes[name] = moment.utc(stopTime.diff(window.camDebugging.startTimes[name]));
      }
    }
    if (window.camDebugging.lateTimes[name]) {
      if (moment().isAfter(window.camDebugging.lateTimes[name])) {
        window.camDebugging.lateTimes[name] = moment();
      }
    } else {
      window.camDebugging.lateTimes[name] = moment();
    }
  }
  if (window.camDebugging.latest) {
    if (moment().isAfter(window.camDebugging.latest)) {
      window.camDebugging.latest = moment();
    }
  } else {
    window.camDebugging.latest = moment();
  }
};

window.camDebugging.incHelper = function incHelper(name) {
  if (name) {
    if (window.camDebugging.helperCounts[name]) {
      window.camDebugging.helperCounts[name] += 1;
    } else {
      window.camDebugging.helperCounts[name] = 1;
    }
  } else {
    window.camDebugging.helperCount += 1;
  }
};

window.camDebugging.resetCount = function resetCount() {
  window.camDebugging.helperCount = 0;
  window.camDebugging.helperCounts = {};
};

window.camDebugging.early = function early(name) {
  if (name) {
    if (window.camDebugging.earlyTimes[name]) {
      if (moment().isBefore(window.camDebugging.earlyTimes[name])) {
        window.camDebugging.earlyTimes[name] = moment();
      }
    } else {
      window.camDebugging.earlyTimes[name] = moment();
    }
  } else
    if (window.camDebugging.earliest) {
      if (moment().isBefore(window.camDebugging.earliest)) {
        window.camDebugging.earliest = moment();
      }
    } else {
      window.camDebugging.earliest = moment();
    }
};

window.camDebugging.late = function late(name) {
  if (name) {
    if (window.camDebugging.lateTimes[name]) {
      if (moment().isBefore(window.camDebugging.lateTimes[name])) {
        window.camDebugging.lateTimes[name] = moment();
      }
    } else {
      window.camDebugging.lateTimes[name] = moment();
    }
  } else
    if (window.camDebugging.latest) {
      if (moment().isAfter(window.camDebugging.latest)) {
        window.camDebugging.latest = moment();
      }
    } else {
      window.camDebugging.latest = moment();
    }
};

window.camDebugging.deltaT = function deltaT() {
  if (window.camDebugging.latest && window.camDebugging.earliest) {
    return moment.utc(window.camDebugging.latest.diff(window.camDebugging.earliest)).format('ss.SSS');
  }
  return '';
};

window.camDebugging.resetDeltaT = function resetDeltaT() {
  window.camDebugging.earliest = null;
  window.camDebugging.latest = null;
};
