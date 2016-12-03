import { Semesters } from './SemesterCollection';

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

export function nextSemester(semester) {
  let sortBy = semester.sortBy;
  const year = Math.trunc(sortBy / 10);
  const semNum = sortBy % 10;
  if (semNum < 2) {
    sortBy += 1;
  } else {
    sortBy = ((year + 1) * 10);
  }
  const next = Semesters.find({ sortBy }).fetch();
  if (next.length > 0) {
    return next[0];
  }
  return undefined;
}

export function nextFallSpringSemester(semester) {
  let sortBy = semester.sortBy;
  const year = Math.trunc(sortBy / 10);
  const semNum = sortBy % 10;
  if (semNum < 2) {
    sortBy += 1;
  } else {
    sortBy = ((year + 1) * 10);
  }
  const next = Semesters.find({ sortBy }).fetch();
  if (next.length > 0) {
    let sem = next[0];
    if (sem.term === Semesters.SUMMER) {
      sem = nextSemester(sem);
    }
    return sem;
  }
  return undefined;
}
