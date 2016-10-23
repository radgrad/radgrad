import { Meteor } from 'meteor/meteor';

import { Semesters } from '../../api/semester/SemesterCollection.js';
import { Courses } from '../../api/course/CourseCollection.js';
import { courseDefinitions } from './icsdata/CourseDefinitions.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Semesters.find().count() === 0) {
    Semesters.define({ term: Semesters.FALL, year: 2015 });
    Semesters.define({ term: Semesters.SPRING, year: 2016 });
    Semesters.define({ term: Semesters.SUMMER, year: 2016 });
    Semesters.define({ term: Semesters.FALL, year: 2016 });
    Semesters.define({ term: Semesters.SPRING, year: 2017 });
    Semesters.define({ term: Semesters.SUMMER, year: 2017 });
    Semesters.define({ term: Semesters.FALL, year: 2017 });
    Semesters.define({ term: Semesters.SPRING, year: 2018 });
    Semesters.define({ term: Semesters.SUMMER, year: 2018 });
  }
  if (Courses.find().count() === 0) {
    courseDefinitions.map((definition) => Courses.define(definition));
  }
});
