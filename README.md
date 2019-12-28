# icsd-scraper
[![NPM](https://nodei.co/npm/icsd-scraper.png)](https://nodei.co/npm/icsd-scraper/)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f5ce4a2e05bc4d2c871a92a3cfd39306)](https://www.codacy.com/manual/yannisalexiou/icsd-scraper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yannisalexiou/icsd-scraper&amp;utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/icsd-scraper.svg)](https://badge.fury.io/js/icsd-scraper)
[![GitHub version](https://badge.fury.io/gh/yannisalexiou%2Ficsd-scraper.svg)](https://badge.fury.io/gh/yannisalexiou%2Ficsd-scraper)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Simple Description
A Node.js package that scraps the [ICSD site](http://www.icsd.aegean.gr/icsd/) and retrieve details about courses and professors.
This package is very useful for thesis work or other academic projects.

## Prefer Python?
My old fella from university [CheatModeOn](https://github.com/CheatModeON/) has made the same module written in python. [Check here](https://github.com/CheatModeON/icsd-scraper).

## Usage

### Install
First install the package using npm:
```
npm install --save icsd-scraper
```
Then, require the package and use it like so:
```javascript
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
Returns all professors as an array of objects with the below details:
* name
* academicRank
* link
* office
* tel
* email
* website
* image

### getBasicCourses
Returns all courses as an array of objects with the below details:
* title
* code
* semester
* ects
* theoryHours
* labHours
* professor
* link

### getAdvancedCourses
Returns all courses as an array of objects with the below details:
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
Insert as argument the link of the course (from `getBasicCourses` use the value of the key with the name link):
Returns an object with the same details as the `getAdvancedCourses`.

## License
GNU GPLv3
