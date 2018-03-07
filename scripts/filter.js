const fs = require('fs');
const _ = require('lodash');

const re = /ics|ee/i;

fs.readFile('starComp.json', 'utf8', function (err, contents) {
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
  console.log(filtered);
  fs.writeFile('alumni.txt', alumniEmail, 'utf8', (err) => {
    if (err) {
      console.log(`Error writing alumni.txt ${err.message}`);
    }
  });
});
