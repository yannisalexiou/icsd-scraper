const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio');

const professorDetails = require('./professor');

//New Links
const academicStaff = 'http://www.icsd.aegean.gr/icsd/akadimaiko';
const labStaff = 'http://www.icsd.aegean.gr/icsd/ergastiriako';
const researchStaff = 'http://www.icsd.aegean.gr/icsd/erevnitiko';

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

async function getAllProfessors() {
  console.log("Start searching... 🧐");

  //Final Array
  var allProfessors = await allProfessorsCategories();

  return allProfessors;
}

var allProfessorsCategories = async () => {

  //The final Array
  var allProfessorsCategories;

  //Make an array from each page
  var academicProfessorsArray = await getProfessorCategory(academicStaff);
  var labProfessorsArray = await getProfessorCategory(labStaff);
  var researchProfessorsArray = await getProfessorCategory(researchStaff);

  //Concat (Merge) all previous arrays into one
  allProfessorsCategories = academicProfessorsArray.concat(
    labProfessorsArray,
    researchProfessorsArray);

  //Search for more detauls for each professor
  for (let i = 0; i < allProfessorsCategories.length; i++) {

    let thisProfessor = allProfessorsCategories[i]
    var professorFullDetails = await getProfessorProfile(thisProfessor);

    //name, office etc
    allProfessorsCategories[i] = professorFullDetails;
  }
  return allProfessorsCategories;

}

var getProfessorCategory = async (url) => {
  let html = await requestTo(url);

  var generalSelector = 'div.grid';

  //The final Array
  var professorsOfThisCategory = professorSectionDiv(generalSelector, html);
  return professorsOfThisCategory;

}

function professorSectionDiv(selector, html) {
  var $ = cheerio.load(html);
  var fullSideListFiltered = $(selector).filter(function() {
    var data = $(this);
    return data;
  });

  const professorsProfieArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr/icsd/';

  professorsOfThisCategory = fullSideListFiltered.children('div').each(function(i, elem) {
    var data = $(this);

    var name = data.children('a').children('p').eq(0).text();
    var link = data.children('a').attr('href');
    var academicRank = data.attr('data-category');
    academicRank = checkAcademicRank(academicRank);

    var eachItem = {
      name: name,
      link: icsdDomain + link,
      academicRank: academicRank
    }

    professorsProfieArray.push(eachItem);
  });

  return professorsProfieArray;
}

function checkAcademicRank(receivedString) {
  var academicRank = '';
  switch (receivedString) {
    case 'kathigitis':
      academicRank = 'Καθηγητής'
      break;
    case 'anaplirotis':
      academicRank = 'Αναπληρωτής Καθηγητής'
      break;
    case 'mepikouros':
      academicRank = 'Μόνιμος Επίκουρος Καθηγητής'
      break;
    case 'epikouros':
      academicRank = 'Επίκουρος Καθηγητής'
      break;
    case 'meta':
      academicRank = 'Μεταδιδάκτορας'
      break;
    case 'eedip':
      academicRank = 'ΕΔΙΠ/ΕΕΠ'
      break;
    case 'phd':
      academicRank = 'Υποψήφιος Διδάκτορας'
      break;
    case 'external':
      academicRank = 'Εξωτερικός Συνεργάτης'
      break;
    default:
      academicRank = 'Διδάσκων'
  }
  return academicRank;
}

async function getProfessorProfile(thisProfessor) {
  var retrievedProfessorProfile = await professorDetails.getProfessorsDetails(thisProfessor.link);

  var eachProfessorFullDetails = {
    name: thisProfessor.name,
    academicRank: thisProfessor.academicRank,
    link: thisProfessor.link,
    office: retrievedProfessorProfile.office,
    tel: retrievedProfessorProfile.tel,
    email: retrievedProfessorProfile.email,
    website: retrievedProfessorProfile.website,
    image: retrievedProfessorProfile.image
  }
  return eachProfessorFullDetails;
}

module.exports = {
  getAllProfessors
};
