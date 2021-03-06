const fetch = require("node-fetch"); //Helps us make HTTP calls
const cheerio = require("cheerio");

const nameSelector = "ul.m-subheader__breadcrumbs>li:nth-child(7)>a>span>b>i";
const officeSelector = "div>div>ul>li:nth-child(4)>a>span";
const telSelector = "div>div>ul>li:nth-child(3)>a>span";
const emailSelector = "div>div>ul>li:nth-child(2)>a>span.m-nav__link-text-leo";
const websiteSelector = "div>div>ul>li:nth-child(5)";
const imageSelector = "div.m-card-profile__pic-leo>img";
const academicLevelSelector = "a.m-card-profile__email";
const citationsSelector = "div>div>ul>li:nth-child(6)>a";

async function getProfessorsDetails(url) {
  let html = await requestProfessorDetails(url);
  var professorDetailsList = professorDetails(html, url);
  return professorDetailsList
}

async function requestProfessorDetails(url) {
  try {
    const response = await fetch(url);
    const body = await response.text();
    return body;
  } catch (error) {
    console.log(error);
    return error
  }
}

function professorDetails(html, url) {
  var $ = cheerio.load(html);

  var name = $(nameSelector).text();
  var office = $(officeSelector).eq(1).text();
  var tel = $(telSelector).eq(2).text();
  var email = $(emailSelector).eq(0).text();
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
  if (!email.includes(" [dot] ") && !email.indexOf(" [at] ") !== -1) {
    email = "";
  }
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