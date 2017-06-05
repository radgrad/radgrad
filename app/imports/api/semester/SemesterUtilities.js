import { Semesters } from './SemesterCollection';

/** @module api/semester/SemesterUtilities */

/**
 * Defines default semesters from 2014 till 2020.
 */
export function defineSemesters() {
  if (Semesters.find().count() === 0) {
    Semesters.define({ term: Semesters.FALL, year: 2014 });
    Semesters.define({ term: Semesters.SPRING, year: 2015 });
    Semesters.define({ term: Semesters.SUMMER, year: 2015 });
    Semesters.define({ term: Semesters.FALL, year: 2015 });
    Semesters.define({ term: Semesters.SPRING, year: 2016 });
    Semesters.define({ term: Semesters.SUMMER, year: 2016 });
    Semesters.define({ term: Semesters.FALL, year: 2016 });
    Semesters.define({ term: Semesters.SPRING, year: 2017 });
    Semesters.define({ term: Semesters.SUMMER, year: 2017 });
    Semesters.define({ term: Semesters.FALL, year: 2017 });
    Semesters.define({ term: Semesters.SPRING, year: 2018 });
    Semesters.define({ term: Semesters.SUMMER, year: 2018 });
    Semesters.define({ term: Semesters.FALL, year: 2018 });
    Semesters.define({ term: Semesters.SPRING, year: 2019 });
    Semesters.define({ term: Semesters.SUMMER, year: 2019 });
    Semesters.define({ term: Semesters.FALL, year: 2019 });
    Semesters.define({ term: Semesters.SPRING, year: 2020 });
    Semesters.define({ term: Semesters.SUMMER, year: 2020 });
  }
}

/**
 * Returns the next semester given a semester.
 * @param semester the semester.
 * @returns {*}
 */
export function nextSemester(semester) {
  const currentTerm = semester.term;
  const currentYear = semester.year;
  let term;
  let year = currentYear;
  if (currentTerm === Semesters.FALL) {
    term = Semesters.SPRING;
    year += 1;
  } else
    if (currentTerm === Semesters.SPRING) {
      term = Semesters.SUMMER;
    } else {
      term = Semesters.FALL;
    }
  return Semesters.findDoc(Semesters.define({ term, year }));
}

/**
 * Returns the next Fall or Spring semester. Skips over Summer semesters.
 * @param semester the semester
 * @returns {undefined}
 */
export function nextFallSpringSemester(semester) {
  let next = nextSemester(semester);
  if (nextSemester.term === Semesters.SUMMER) {
    next = nextSemester(next);
  }
  return next;
}
