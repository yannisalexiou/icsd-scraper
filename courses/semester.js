const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio');

const course = require('./course');

const coursesUrl = 'http://www.icsd.aegean.gr/icsd/pps';
//New way
const semesterOneSelector = 'div#exam1>div:nth-child(2)>';
const semesterTwoSelector = 'div#exam2>div:nth-child(2)>';
const semesterThreeSelector = 'div#exam3>div:nth-child(2)>';
const semesterFourSelector = 'div#exam4>div:nth-child(2)>';
const semesterFiveSelector = 'div#exam5>div:nth-child(2)>';
const semesterSixSelector = 'div#exam6>div:nth-child(2)>';
const semesterSevenSelector = 'div#exam7>div:nth-child(2)>';
const semesterEightSelector = 'div#exam8>div:nth-child(2)>';
const semesterNineSelector = 'div#exam9>div:nth-child(2)>';
const semesterTenSelector = 'div#exam10>div:nth-child(2)>';

//Append
const compulsorySemesterTableSelector = 'div>div:nth-child(1)>table>tbody';
const cicleSemesterTableSelector = 'div>div:nth-child(2)';
const optionalSemesterTableSelector = 'div>div:nth-child(3)>table>tbody';
const freeCourseSemesterTableSelector = 'div>div:nth-child(4)>table>tbody'

function requestTo(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function checkSemesters(isBasic) {
  //The final Array
  var allCourses;

  var semesterOneCourses = await getCourseStructOfSemester(semesterOneSelector);
  var semesterTwoCourses = await getCourseStructOfSemester(semesterTwoSelector);
  var semesterThreeCourses = await getCourseStructOfSemester(semesterThreeSelector);
  var semesterFourCourses = await getCourseStructOfSemester(semesterFourSelector);
  var semesterFiveCourses = await getCourseStructOfSemester(semesterFiveSelector);
  var semesterSixCourses = await getCourseStructOfSemester(semesterSixSelector);
  var semesterSevenCourses = await getCourseStructOfSemester(semesterSevenSelector);
  var semesterEightCourses = await getCourseStructOfSemester(semesterEightSelector);
  var semesterNineCourses = await getCourseStructOfSemester(semesterNineSelector);
  var semesterTenCourses = await getCourseStructOfSemester(semesterTenSelector);

  allCourses = semesterOneCourses.concat(
    semesterTwoCourses,
    semesterThreeCourses,
    semesterFourCourses,
    semesterFiveCourses,
    semesterSixCourses,
    semesterSevenCourses,
    semesterEightCourses,
    semesterNineCourses,
    semesterTenCourses
  );

  //TODO: Change = to ==
  if (isBasic == true) {
    var basicCourseData = [];
    for (var i = 0; i < allCourses.length; i++) {
      //console.log("Title: " + allCourses[i].title);
      var thisBasicData = await course.getBasicCourseDetails(allCourses[i].link);
      basicCourseData.push(thisBasicData);
    }
    return basicCourseData;

  } else {
    var advancedCourseData = [];
    for (var i = 0; i < allCourses.length; i++) {
      var thisAdvancedCourseData = await course.getAllCourseDetails(allCourses[i].link);
      advancedCourseData.push(thisAdvancedCourseData);
    }
    return advancedCourseData;
  }
}

async function getCourseStructOfSemester(semesterSelector) {

  var semester = identifySemester(semesterSelector);
  var thisSemesterCourses;
  if (semester < 7 || semester == 10) {
    //Compulsory
    thisSemesterCourses = await getCompulsorySemesterCourses(semesterSelector, semester);
  } else {
    //Cycle
    thisSemesterCourses = await getCycleSemesterCourses(semesterSelector, semester)
  }

  return thisSemesterCourses;
}

async function getCompulsorySemesterCourses(semesterSelector, semester) {
  let html = await requestTo(coursesUrl);
  //The final Array
  var coursesOfThisSemester;

  var tableSelector = semesterSelector + compulsorySemesterTableSelector;
  var thisSemesterCompulsoryCourses = await simpleSemesterSelector(html, tableSelector, semester);
  var tableSelector = semesterSelector + optionalSemesterTableSelector;
  var thisSemesterOptionalCourses = await simpleSemesterSelector(html, tableSelector, semester);
  coursesOfThisSemester = thisSemesterCompulsoryCourses.concat(
    thisSemesterOptionalCourses
  );

  return coursesOfThisSemester;
}

function simpleSemesterSelector(html, selector, semester) {
  var $ = cheerio.load(html);
  var tableFiltered = $(selector).filter(function () {
    var data = $(this);
    return data;
  });

  var coursesArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr/icsd/pps_lessons.php?lesson_id=';

  coursesOfThisSemester = tableFiltered.children('tr').each(function (i, elem) {
    var data = $(this);

    var row = data.children();
    var code = row.eq(0).text();
    var title = row.eq(1).text();
    var link = row.eq(1).attr('href');
    var theoryHours = row.eq(2).text();
    var labHours = row.eq(3).text();
    var ects = row.eq(4).text();

    var eachItem = {
      code: code,
      title: title,
      kind: 'Compulsory',
      semester: semester,
      link: icsdDomain + code,
      theoryHours: theoryHours,
      labHours: labHours,
      ects: ects
    }

    coursesArray.push(eachItem);
  });
  return coursesArray;
}

async function getCycleSemesterCourses(semesterSelector, semester) {
  let html = await requestTo(coursesUrl);
  //The final Array
  var coursesOfThisSemester;

  //Semester regular
  var tableSelector = semesterSelector + cicleSemesterTableSelector;
  var thisSemesterCourses = await cycleSemesterSelector(html, tableSelector, semester);
  //Semester optional
  var tableSelector = semesterSelector + optionalSemesterTableSelector;
  var thisSemesterOptionalCourses = await simpleSemesterSelector(html, tableSelector, semester);
  //Semester free
  var tableSelector = semesterSelector + freeCourseSemesterTableSelector;
  var thisSemesterFreeCourses = await simpleSemesterSelector(html, tableSelector, semester);
  
  var coursesOfThisSemester = thisSemesterCourses.concat(
    thisSemesterOptionalCourses,
    thisSemesterFreeCourses
  );
  return coursesOfThisSemester;
}

function cycleSemesterSelector(html, selector, semester) {
  var $ = cheerio.load(html);
  var tableFiltered = $(selector).filter(function () {
    var data = $(this);
    return data;
  });

  var coursesArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr/icsd/pps_lessons.php?lesson_id=';

  tableFiltered.children('table').children('tbody').each(function (i, elem) {
    var data = $(this);

    data.children('tr').each(function (i, elem) {
      var data = $(this);

      var row = data.children();

      var code = row.eq(0).text();
      var title = row.eq(1).text();
      var link = row.eq(1).attr('href');
      var theoryHours = row.eq(2).text();
      var labHours = row.eq(3).text();
      var ects = row.eq(4).text();

      var eachItem = {
        code: code,
        title: title,
        kind: 'cycle',
        semester: semester,
        link: icsdDomain + code,
        theoryHours: theoryHours,
        labHours: labHours,
        ects: ects
      }

      coursesArray.push(eachItem);
    });

  });


  return coursesArray;
}

function identifySemester(semeterUrl) {
  //var semeterUrl = 'div#exam1>div:nth-child(2)';
  var semester = semeterUrl.split('exam')[1].split('>')[0];
  return semester;
}

module.exports = {
  checkSemesters
};