const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio');

const nameSelector = 'table#table1>tbody>tr:nth-child(1)>td:nth-child(3)';
const officeSelector = 'table#table1>tbody>tr:nth-child(2)>td:nth-child(2)';
const telSelector = 'table#table1>tbody>tr:nth-child(3)>td:nth-child(2)';
const emailSelector = 'table#table1>tbody>tr:nth-child(4)>td:nth-child(2)';
const websiteSelector = 'table#table1>tbody>tr:nth-child(5)>td:nth-child(2)';
const imageSelector = 'table#table1>tbody>tr:nth-child(1)>td:nth-child(1)>center>img';

async function getProfessorsDetails(url) {
  let html = await requestProfessorDetails(url);
  var professorDetailsList = professorDetails(html);
  return professorDetailsList
}

function requestProfessorDetails(url) {
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

function professorDetails(html) {
  var $ = cheerio.load(html);
  var name = $(nameSelector).text();
  var office = $(officeSelector).text();
  var tel = $(telSelector).text();
  var email = $(emailSelector).text();
  var website = $(websiteSelector).text();
  var image = $(imageSelector).attr('src');

  var details = {
    name: name,
    office: office,
    tel: tel,
    email: email,
    website: website,
    image: image
  }

  return details
}

module.exports = {getProfessorsDetails};
