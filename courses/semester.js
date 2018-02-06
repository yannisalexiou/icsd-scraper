const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio');

const course = require('./course');

const semesterOneURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=1';
const semesterTwoURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=2';
const semesterThreeURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=3';
const semesterFourURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=4';
const semesterFiveURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=5';
const semesterSixURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=6';
const semesterSevenURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=7';
const semesterEightURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=8';
const semesterNineURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=9';
const semesterTenURL = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/mathimata_ana_examino.php?semester=10';

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

async function checkSemesters() {
  //The final Array
  var allCourses;

  var semesterOneCourses = await getCourseStructOfSemester(semesterOneURL);
  var semesterTwoCourses = await getCourseStructOfSemester(semesterTwoURL);
  var semesterThreeCourses = await getCourseStructOfSemester(semesterThreeURL);
  var semesterFourCourses = await getCourseStructOfSemester(semesterFourURL);
  var semesterFiveCourses = await getCourseStructOfSemester(semesterFiveURL);
  var semesterSixCourses = await getCourseStructOfSemester(semesterSixURL);
  var semesterSevenCourses = await getCourseStructOfSemester(semesterSevenURL);
  var semesterEightCourses = await getCourseStructOfSemester(semesterEightURL);
  var semesterNineCourses = await getCourseStructOfSemester(semesterNineURL);
  var semesterTenCourses = await getCourseStructOfSemester(semesterTenURL);

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

  for (var i = 0; i < allCourses.length; i++) {
    console.log("Title: " + allCourses[i].title);
    var basicCourseData = await course.getBasicCourseDetails(allCourses[i].link);
    console.log("Professor: " + basicCourseData.professor);
    console.log();
  }

}

async function getCourseStructOfSemester(url) {

  var semester = identifySemester(url);
  var thisSemesterCourses;
  console.log("Semester: " + semester );
  if (semester < 7 || semester == 10) {
    //Compulsory
    thisSemesterCourses = await getCompulsorySemesterCourses(url, semester);
  }
  else {
    //Cycle
    thisSemesterCourses = await getCycleSemesterCourses(url, semester)
  }

  return thisSemesterCourses;
}

async function getCompulsorySemesterCourses(url, semester) {
  let html = await requestTo(url);
  //The final Array
  var coursesOfThisSemester;

  var tableSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table:nth-child(3)>tbody';
  var thisSemesterCourses = await compulsorySemesterSelector(html, tableSelector, semester);
  return thisSemesterCourses;

}

function compulsorySemesterSelector(html, selector, semester) {
  var $ = cheerio.load(html);
  var tableFiltered = $(selector).filter(function() {
    var data = $(this);
    return data;
  });

  var coursesArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr';

  coursesOfThisSemester = tableFiltered.children('tr').each(function(i, elem) {
    var data = $(this);
    //console.log("data: " + data);

    var isLesson = data.children().attr('align');
    if (isLesson) {
      var row = data.children().children();

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
        link: icsdDomain + link,
        theoryHours: theoryHours,
        labHours: labHours,
        ects: ects
      }
      //console.log("eachItem code: " + eachItem.code);
      coursesArray.push(eachItem);
    }
  });
  return coursesArray;
}

async function getCycleSemesterCourses(url, semester) {
  let html = await requestTo(url);
  //The final Array
  var coursesOfThisSemester;

  var tableSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody';
  var thisSemesterCourses = await cycleSemesterSelector(html, tableSelector, semester);
  return thisSemesterCourses;
}

function cycleSemesterSelector(html, selector, semester) {
  var $ = cheerio.load(html);
  var tableFiltered = $(selector).filter(function() {
    var data = $(this);
    return data;
  });
  //console.log("tableFiltered: " + tableFiltered);
  var coursesArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr';

  coursesOfThisSemester = tableFiltered.children('tr').each(function(i, elem) {
    var data = $(this);
    //console.log("data: " + data);

    var isLesson = data.children().attr('align');
    if (isLesson) {
      var row = data.children().children();

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
        link: icsdDomain + link,
        theoryHours: theoryHours,
        labHours: labHours,
        ects: ects
      }
      //console.log("eachItem code: " + eachItem.title);
      coursesArray.push(eachItem);
    }
  });
  return coursesArray;
}

function identifySemester(semeterUrl) {
  var splittedLink = splitEqual(semeterUrl);
  var semester = splittedLink[1];
  return semester;
}

function splitEqual(receivedMessage) {
  var fields = receivedMessage.split('=');

  return fields;
}

//getCourseStructOfSemester(semesterSevenURL);
checkSemesters();
