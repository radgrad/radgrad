const request = require('request');
const fs = require('fs');
const inquirer = require('inquirer');

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
      .then(res => fs.writeFileSync(r.filename, res.body))
      .catch(err => console.log(err));
}

/**
 * Edit the file emails.txt to list the student email addresses. Then run node download-bulk-star-json.js
 */
downloadStarData();
