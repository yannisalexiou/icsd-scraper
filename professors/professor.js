const request = require("request"); //Helps us make HTTP calls
const cheerio = require("cheerio");

const nameSelector = "ul.m-subheader__breadcrumbs>li:nth-child(7)>a>span>b>i";
const officeSelector = "div>div>ul>li:nth-child(4)>a>span";
const telSelector = "div>div>ul>li:nth-child(3)>a>span";
const emailSelector = "div>div>ul>li:nth-child(2)>a>span";
const websiteSelector = "div>div>ul>li:nth-child(5)";
const imageSelector = "div.m-card-profile__pic-leo>img";
const academicLevelSelector = "a.m-card-profile__email";
const citationsSelector = "div>div>ul>li:nth-child(6)>a";

async function getProfessorsDetails(url) {
  let html = await requestProfessorDetails(url);
  var professorDetailsList = professorDetails(html, url);
  return professorDetailsList
}

function requestProfessorDetails(url) {
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

function professorDetails(html, url) {
  var $ = cheerio.load(html);

  var name = $(nameSelector).text();
  var office = $(officeSelector).eq(1).text();
  var tel = $(telSelector).eq(2).text();
  var email = $(emailSelector).eq(3).text();
  var website = $(websiteSelector).eq(2).children("a").attr("href");
  var image = $(imageSelector).attr("src");
  var citations = $(citationsSelector).eq(1).attr("href");
  var academicLevel = $(academicLevelSelector).text();

  //Normatlize data
  //Normatlize website
  if (website.indexOf("javascript") !== -1) {
    website = url;
  }
  //Normalize email
  if (email.indexOf(" [at] ") !== -1) {
    email = email.replace(" [at] ", "@");
  }
  if (email.includes(" [dot] ")) {
    email = email.replace(" [dot] ", ".")
  }
  
  var details = {
    name: name,
    office: office,
    tel: tel,
    email: email,
    website: website,
    image: image,
    academicLevel: academicLevel,
    citations: citations
  }

  return details
}

module.exports = {
  getProfessorsDetails
};