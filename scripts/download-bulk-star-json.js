const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');
const _ = require('lodash');
const moment = require('moment');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function getStarArrivalTime() {
  const emailData = fs.readFileSync('./emails.txt');
  const numEmails = emailData.toString().split('\n').length;
  const arrivalTime = moment().add(numEmails * 10, 's');
  // eslint-disable-next-line
  return `Obtaining STAR data for ${numEmails} users. Results expected at ${arrivalTime.format('h:mm A')} (${arrivalTime.fromNow()})`;
}

/**
 * Read emails.txt which is a newline delimited list of UH email addresses
 * Pass email list as part of the url encoded form to the STAR-RadGrad api
 * Return the response which should be a JSON object
 */
function getCourseData(username, password) {
  const params = {
    form: {
      uid: username,
      password: password,
      emails: fs.readFileSync('./emails.txt'),
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

/**
 * Determine if a student's data represents an alumni.
 * This is heuristically determined by checking to see if there are no ICS or EE courses in their course data.
 * If an alumni is detected, then put them into the alumni.txt file and remove their data from the json file.
 */
function filterAlumni(contents) {
  const re = /ics|ee/i;
  const alumniEmail = [];
  const data = JSON.parse(contents);
  // console.log(data);
  _.forEach(data, (student) => {
    let alumni = true;
    // console.log(student.courses);
    _.forEach(student.courses, (c) => {
      if (c.name.match(re)) {
        alumni = false;
      }
    });
    if (alumni) {
      alumniEmail.push(student.email);
    }
    // console.log(`${student.email} is alumni = ${alumni}.`);
  });
  const filtered = _.filter(data, function (d) {
    let student = false;
    // console.log(student.courses);
    _.forEach(d.courses, (c) => {
      if (c.name.match(re)) {
        student = true;
      }
    });
    return student;
  });
  fs.writeFile('alumni.txt', alumniEmail.join('\n'), 'utf8', (err) => {
    if (err) {
      console.log(`Error writing alumni.txt ${err.message}`);
    }
  });
  return JSON.stringify(filtered, null, ' ');
}

/**
 * Main function. Ask for the admin's username, password, and file to put the json data into.
 * Then call getCourseData to get the data from STAR.
 * @returns {Promise<void>}
 */
async function downloadStarData() {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your UH username:',
      validate: value => (value.length ? true : 'Please enter your UH username'),
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: value => (value.length ? true : 'Please enter your password'),
    },
    {
      name: 'filename',
      type: 'input',
      message: 'Enter the file name where the data will be saved:',
      validate: value => (value.length ? true : 'Please enter the file name.'),
    },
  ];

  const userParams = await inquirer.prompt(questions);
  console.log(getStarArrivalTime());
  getCourseData(userParams.username, userParams.password)
      .then(res => fs.writeFileSync(userParams.filename, filterAlumni(res.body)))
      .catch(err => console.log(err));
}

/**
 * emails.txt must have student email addresses, one per line. Then run node download-bulk-star-json.js
 */
downloadStarData();
