import { Semesters } from './SemesterCollection';

/**
 * Defines default semesters from 2014 till 2020.
 * @memberOf api/semester
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
 * Returns the next semester document given a semester document.
 * @param semesterDoc the semester doc.
 * @returns The next semester doc.
 * @memberOf api/semester
 */
export function nextSemester(semesterDoc) {
  const currentTerm = semesterDoc.term;
  const currentYear = semesterDoc.year;
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
 * Returns the next Fall or Spring semester doc. Skips over Summer semesters.
 * @param semester the semester doc.
 * @returns The next semester doc (excluding summer).
 * @memberOf api/semester
 */
export function nextFallSpringSemester(semester) {
  let next = nextSemester(semester);
  if (nextSemester.term === Semesters.SUMMER) {
    next = nextSemester(next);
  }
  return next;
}
