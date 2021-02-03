const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');
const _ = require('lodash');
const moment = require('moment');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function splitEmails(emails, key, emailsPerFile) {
  const emailData = fs.readFileSync(`./${emails}`);
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

function getStarArrivalTime(emails) {
  const emailData = fs.readFileSync(`./${emails}`);
  const numEmails = emailData.toString().split('\n').length;
  const arrivalTime = moment().add(numEmails * 10, 's');
  // eslint-disable-next-line
  return `Obtaining STAR data for ${numEmails} users. Results expected at ${arrivalTime.format('h:mm A')} (${arrivalTime.fromNow()})`;
}

/**
 * Read emails file which is a newline delimited list of UH email addresses
 * Pass email list as part of the url encoded form to the STAR-RadGrad api
 * Return the response which should be a JSON object
 */
function getCourseData(username, password, emails) {
  const params = {
    form: {
      uid: username,
      password: password,
      emails: fs.readFileSync(`./${emails}`),
    },
  };

  return new Promise((res, rej) => {
    request.post('https://www.star.hawaii.edu:10011/api/radgrad', params, function (err, httpRes, body) {
    // request.post('https://www.star.hawaii.edu/api/radgrad/courses', params, function (err, httpRes, body) {
      if (err) return rej(err);
      return res(httpRes);
    });
  });
}

function courseIsInteresting(courseName) {
  return courseName.match(/ics/i);
}

/**
 * Determine if a student's data represents an alumni.
 * This is heuristically determined by checking to see if there are no ICS or EE courses in their course data.
 * If an alumni is detected, then put them into the alumni.txt file and remove their data from the json file.
 */
function filterAlumni(contents, key) {
  // console.log(contents);
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
  fs.writeFile(`alumni${key}.txt`, alumniEmail.join('\n'), 'utf8', (err) => {
    if (err) {
      console.log(`Error writing alumni${key}.txt ${err.message}`);
    }
  });
  return JSON.stringify(filtered, null, ' ');
}

/**
 * Main function. Ask for the admin's username, password, the name of the email list file
 * and file to put the json data into.
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
      name: 'key',
      type: 'input',
      message: 'Enter the emails list key: (e.g. emails{key}.txt',
      validate: value => (value.length ? true : 'Please enter the email list file name'),
    },
    {
      name: 'emailsPerFile',
      type: 'input',
      message: 'Enter the number of emails per file: ',
      validate: value => {
        const num = parseInt(value, 10);
        return (num > 0 ? true : 'Please enter a positive number');
      },
    },
  ];

  const userParams = await inquirer.prompt(questions);
  const emailFileName = `emails${userParams.key}.txt`;
  const numEmailsPerFile = parseInt(userParams.emailsPerFile, 10);
  const key = userParams.key;
  const keys = splitEmails(emailFileName, key, numEmailsPerFile);
  _.forEach(keys, (k) => {
    const eFileName = `emails${k}.txt`;
    const sFileName = `star${k}.json`;
    console.log(getStarArrivalTime(eFileName));
    getCourseData(userParams.username, userParams.password, eFileName)
        .then(res => fs.writeFileSync(sFileName, filterAlumni(res.body, k)))
        .catch(err => console.log(err));
  });
  // const starFilenName = `star${userParams.key}.json`;
  // console.log(getStarArrivalTime(emailFileName));
  // getCourseData(userParams.username, userParams.password, emailFileName)
  //     .then(res => fs.writeFileSync(starFilenName, filterAlumni(res.body, userParams.key)))
  //     .catch(err => console.log(err));
}

/**
 * emails.txt must have student email addresses, one per line. Then run node download-bulk-star-json.js
 */
downloadStarData();
