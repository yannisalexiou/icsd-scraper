# icsd-scraper
[![NPM](https://nodei.co/npm/icsd-scraper.png)](https://nodei.co/npm/icsd-scraper/)

[![npm version](https://badge.fury.io/js/icsd-scraper.svg)](https://badge.fury.io/js/icsd-scraper)
[![GitHub version](https://badge.fury.io/gh/yannisalexiou%2Ficsd-scraper.svg)](https://badge.fury.io/gh/yannisalexiou%2Ficsd-scraper)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

##Simple Description
A Node.js package that scraps the [ICSD site](http://www.icsd.aegean.gr/icsd/) and retrieve informations about courses and professors.
This package is very useful for thesis work or other academic projects.

## Usage

### Install
First install the package using npm:
```
npm install --save icsd-scraper
```
Then, require the package and use it like so:
```
const icsdScraper = require('icsd-scraper');

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
Returns all professors with the below details, as an array of objects:
* name
* academicRank
* link
* office
* tel
* email
* website
* image

### getBasicCourses
Returns all courses with the below details, as an array of objects:
* title
* code
* semester
* ects
* theoryHours
* labHours
* professor
* link

### getAdvancedCourses
Returns all courses with the below details, as an array of objects:
* title
* code
* semester
* ects
* theoryHours
* labHours
* professor
* link
* courseWebsite
* contentOutline
* learningOutcomes
* prerequisites
* basicTextbooks
* additionalReferences
* teachingMethod
* grandingMethod
* languageOfInstruction
* modeOfDelivery

**⚠️Ιmportant:** `getAdvancedCourses` doesn't always work properly due to lack of consistency of ICSD site. So it's better to use the `getBasicCourses` to retrieve basic course informations and then if you want more, use `getAdvancedCourseDetails(url)` to see the differences.

### getAdvancedCourseDetails(url)
Insert as argument the link of the course (from getBasicCourses use the key link):
Returns an object withe the same details as getAdvancedCourses

## License
GNU GPLv3
