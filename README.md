# icsd-scraper

A Node.js package that scrap the icsd site

## Usage

### Install
First install the package using npm:
```
npm install --save icsd-scraper
```
Then, require the package and use it like so:
```
const icsdScraper = require('./icsd-scraper');

var allProfessors = icsdScraper.getProfessors();
var basicCoursesInfo = icsdScraper.getBasicCourses();
var advancedCoursesInfo = icsdScraper.getAdvancedCourses();

allProfessors.then(function (results) {
  console.log("allProfessors", results);
})

basicCoursesInfo.then(function (results) {
  console.log("basicCoursesInfo", results);
})

advancedCoursesInfo.then(function (results) {
  console.log("advancedCoursesInfo", results);
})
```
## Functions Documentation
### getProfessors
Returns all professors with the above details:
name, academicRank, link, office, tel, email, website, image.

### getBasicCourses
Returns all courses with the above details:
title, code, semester, ects, theoryHours, labHours, professor, link.

### getAdvancedCourses
Returns all courses with the above details:
title, code, semester, ects, theoryHours, labHours, professor, link, courseWebsite, contentOutline, learningOutcomes, prerequisites, basicTextbooks, additionalReferences, teachingMethod, grandingMethod, languageOfInstruction, modeOfDelivery.

## License

GNU GPLv3
