const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio');
var testUrl = 'http://www.icsd.aegean.gr/icsd/proptyxiaka/istoselida_mathimatos.php?lesson_id=321-9703';

const generalSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)';
const firstFixTableSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(2)>td';
const courseWebsiteSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(5)>td';
const contentOutlineSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(8)>td>p'
const learningOutcomesSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(11)>td>p';
const prerequisitesSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(14)>td>p';
const basicTextbooksSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(17)>td>p';
const additionalReferencesSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(20)>td>p';
const teachingMethodSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(23)>td>p';
const grandingMethodSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(26)>td>p';
const languageOfInstructionSelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(29)>td';
const modeOfDeliverySelector = 'table.wrapper>tbody>tr>td>center:nth-child(10)>table>tbody>tr:nth-child(1)>td>center>table>tbody>tr>td:nth-child(2)>table>tbody>tr:nth-child(32)>td>p';

function requestCourseDetails(url) {
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

async function getAllCourseDetails(url) {
  let html = await requestCourseDetails(url);
  var allCourseDetailsList = allCourseDetails(html);
  return allCourseDetailsList
}

async function getBasicCourseDetails(url) {
  let html = await requestCourseDetails(url);
  var basicCourseDetailsList = basicCourseData(html);
  return basicCourseDetailsList;
}

async function getAdvnacedCourseDetails(url) {
  let html = await requestCourseDetails(url);
  var advancedCourseDetailsList = advancedCourseData(html);
  return advancedCourseDetailsList;
}

function allCourseDetails(html) {
  var basicData = basicCourseData(html);
  var advancedData = advancedCourseData(html);

  var finalData = Object.assign(basicData, advancedData);

  return finalData;
}

function basicCourseData(html) {
  var $ = cheerio.load(html);
  var firstFixTable = $('table.mathima>tbody>tr').filter(function() {
    var data = $(this);
    return data;
  });

  var title = firstFixTable.children().children().eq(1).text();
  var code = firstFixTable.children().children().eq(3).text();
  var semester = firstFixTable.children().children().eq(5).text();
  var ects = firstFixTable.children().children().eq(7).text();
  var theoryHours = firstFixTable.children().children().eq(9).text();
  var labHours = firstFixTable.children().children().eq(11).text();
  var professor = firstFixTable.children().children().eq(13).text();

  var basicData = {
    title: title,
    code: code,
    semester: semester,
    ects: ects,
    theoryHours: theoryHours,
    labHours: labHours,
    professor: professor
  }

  return basicData;
}

function advancedCourseData(html) {
  var $ = cheerio.load(html);

  var courseWebsite = $(courseWebsiteSelector).text();
  var contentOutline = $(contentOutlineSelector).text();
  var learningOutcomes = $(learningOutcomesSelector).text();
  var prerequisites = $(prerequisitesSelector).text();
  var basicTextbooks = $(basicTextbooksSelector).text();
  var additionalReferences = $(additionalReferencesSelector).text();
  var teachingMethod = $(teachingMethodSelector).text();
  var grandingMethod = $(grandingMethodSelector).text();
  var languageOfInstruction = $(languageOfInstructionSelector).text();
  var modeOfDelivery = $(modeOfDeliverySelector).text();

  var advancedData = {
    courseWebsite: courseWebsite,
    contentOutline: contentOutline,
    learningOutcomes: learningOutcomes,
    prerequisites: prerequisites,
    basicTextbooks: basicTextbooks,
    additionalReferences: additionalReferences,
    teachingMethod: teachingMethod,
    grandingMethod: grandingMethod,
    languageOfInstruction: languageOfInstruction,
    modeOfDelivery: modeOfDelivery
  }

  return advancedData;
}

//getAllCourseDetails(testUrl);

module.exports = {
  getAllCourseDetails,
  getBasicCourseDetails,
  getAdvnacedCourseDetails
};
