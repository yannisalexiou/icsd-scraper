const request = require("request"); //Helps us make HTTP calls
const cheerio = require("cheerio");

//const generalSelector = "div.tab-content";
const contentOutlineSelector = "div.tab-content>div:nth-child(3)>div:nth-child(2)>p";
const learningOutcomesSelector = "div.tab-content>div:nth-child(4)>div:nth-child(2)>";
const prerequisitesSelector = "div.tab-content>div:nth-child(5)>div:nth-child(2)>p";
const basicTextbooksSelector = "div.tab-content>div:nth-child(6)>div:nth-child(2)>";
const additionalReferencesSelector = "div.tab-content>div:nth-child(7)>div:nth-child(2)>";
const teachingMethodSelector = "div.tab-content>div:nth-child(8)>div:nth-child(2)>p";
const grandingMethodSelector = "div.tab-content>div:nth-child(9)>div:nth-child(2)>p";
const languageOfInstructionSelector = "div.tab-content>div:nth-child(10)>div:nth-child(2)";
const modeOfDeliverySelector = "div.tab-content>div:nth-child(11)>div:nth-child(2)>p";

function requestCourseDetails(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

async function getAllCourseDetails(url) {
    let html = await requestCourseDetails(url);
    var allCourseDetailsList = allCourseDetails(html, url);
    return allCourseDetailsList
}

async function getBasicCourseDetails(url) {
    let html = await requestCourseDetails(url);
    var basicCourseDetailsList = basicCourseData(html, url);
    return basicCourseDetailsList;
}

async function getAdvancedCourseDetails(url) {
    let html = await requestCourseDetails(url);
    var advancedCourseDetailsList = advancedCourseData(html, url);
    return advancedCourseDetailsList;
}

function allCourseDetails(html, url) {
    var basicData = basicCourseData(html, url);
    var advancedData = advancedCourseData(html, url);

    var finalData = Object.assign(basicData, advancedData);

    return finalData;
}

function basicCourseData(html, url) {
    var $ = cheerio.load(html);
    var firstFixTable = $("table.table>tbody").filter(function () {
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
        professor: professor,
        link: url
    }

    return basicData;
}

function advancedCourseData(html, url) {
    var $ = cheerio.load(html);

    var courseWebsite = url;
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

module.exports = {
    getAllCourseDetails,
    getBasicCourseDetails,
    getAdvancedCourseDetails
};