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
