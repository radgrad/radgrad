const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');
const _ = require('lodash');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Read emails.txt which is a newline delimited list of UH email addresses
 * Pass email list as part of the url encoded form to the STAR-RadGrad api
 * Return the response which should be a JSON object
 */
function testRadgradCourses(username, password) {
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
    console.log(`${student.email} is alumni = ${alumni}.`);
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

async function downloadStarData() {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your UH username:',
      validate: function (value) {
        if (value.length) {
          return true;
        }
        return 'Please enter your UH username';
      },
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: function (value) {
        if (value.length) {
          return true;
        }
        return 'Please enter your password';
      },
    },
    {
      name: 'filename',
      type: 'input',
      message: 'Enter the file name to save the data to',
      validate: function (value) {
        if (value.length) {
          return true;
        }
        return 'Please enter a file name.';
      },
    },
  ];

  const r = await inquirer.prompt(questions);
  testRadgradCourses(r.username, r.password)
      .then(res => fs.writeFileSync(r.filename, filterAlumni(res.body)))
      .catch(err => console.log(err));
}

/**
 * Edit the file emails.txt to list the student email addresses. Then run node download-bulk-star-json.js
 */
downloadStarData();
