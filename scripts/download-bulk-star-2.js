const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');
const _ = require('lodash');
const moment = require('moment');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function splitEmails(emailsFilename, key, emailsPerFile) {
  const emailData = fs.readFileSync(`./${emailsFilename}`);
  const emailArr = emailData.toString().split('\n');
  const numEmails = emailArr.length;
  let count = 1;
  let start = 0;
  let end = emailsPerFile;
  const retVal = {};
  retVal.keys = [];
  while (end < numEmails + emailsPerFile) {
    retVal.keys.push(`${key}-${count}`);
    fs.writeFileSync(`emails${key}-${count}.txt`, emailArr.slice(start, end).join('\n'));
    count++;
    start += emailsPerFile;
    end += emailsPerFile;
  }
  return retVal.keys;
}

/**
 * Returns a string with the estimated time to download STAR data for the usernames in emails.
 * @param emailFilename the name of the file containing student email addresses.
 * @returns {string}
 */
function getStarArrivalTime(emailFilename) {
  const emailData = fs.readFileSync(`./${emailFilename}`);
  const numEmails = emailData.toString().split('\n').length;
  const arrivalTime = moment().add(numEmails * 10, 's');
  // eslint-disable-next-line
  return `Obtaining STAR data for ${numEmails} users. Results expected at ${arrivalTime.format('h:mm A')} (${arrivalTime.fromNow()})`;
}

/**
 * Returns a Promise that gets the STAR data for the emails in emailData.
 * @param username the UH username of the person making the STAR request.
 * @param password their UH password.
 * @param emailData a string the student email addresses separated by \n.
 * @returns {Promise<any>}
 */
function getStarData(username, password, emailData) {
  const params = {
    form: {
      uid: username,
      password: password,
      emails: emailData,
    },
  };

  return new Promise((res, rej) => {
    // request.post('https://www.star.hawaii.edu:10011/api/radgrad', params, function (err, httpRes, body) {
    request.post('https://www.star.hawaii.edu/api/radgrad', params, function (err, httpRes, body) {
      if (err) return rej(err);
      return res(httpRes);
    });
  });
}

