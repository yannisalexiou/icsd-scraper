const request = require('request'); //Helps us make HTTP calls
const cheerio = require('cheerio');

const professorDetails = require('./professor');

//Links to search
const urlDep = 'http://www.icsd.aegean.gr/icsd/prosopiko/members.php?category=dep';
const urlPd407 = 'http://www.icsd.aegean.gr/icsd/prosopiko/members.php?category=pd407';
const urlPostDoc = 'http://www.icsd.aegean.gr/icsd/prosopiko/members.php?category=postdoc';
const ulrOthers = 'http://www.icsd.aegean.gr/icsd/prosopiko/members.php?category=other';
const urlEedip = 'http://www.icsd.aegean.gr/icsd/prosopiko/members.php?category=eedip';
const urlEtep = 'http://www.icsd.aegean.gr/icsd/prosopiko/members.php?category=etep';

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
  console.log("Please wait 🤓");
  //Final Array
  var allProfessors;

  var allDepProfessors = await getDepCategoryProfessors(urlDep);
  console.log("I still searching 🧐 \n");
  var allOtherProfessors = await allOtherCategoriesProfessors();

  allProfessors = allDepProfessors.concat(allOtherProfessors);

  // var counter = 0;
  // for (var i = 0; i < allProfessors.length; i++) {
  //   console.log("Name: " + allProfessors[i].name);
  //   console.log("Academic Grade: " + allProfessors[i].academicRank);
  //   console.log("Office: " + allProfessors[i].office);
  //   console.log("Link: " + allProfessors[i].link);
  //   console.log("Tel: " + allProfessors[i].tel);
  //   //console.log("Email: " + allProfessors[i].email);
  //   console.log("Website: " + allProfessors[i].website);
  //   console.log("Image: " + allProfessors[i].image);
  //   console.log();
  //   counter++;
  // }
  // console.log("Όλοι οι καθηγητές του ICSD: " + counter);

  return allProfessors;

}


var getDepCategoryProfessors = async (url) => {
  let html = await requestTo(url);

  //The final Array
  var professorsOfThisCategory;

  //Creating the Selectors for each Table
  var professors = 'table.menu_default>tbody>tr:nth-child(2)>td>table:nth-child(1)>tbody>tr';
  var associateProfessors = 'table.menu_default>tbody>tr:nth-child(2)>td>table:nth-child(3)>tbody>tr';
  var permantAssistantProfessors = 'table.menu_default>tbody>tr:nth-child(2)>td>table:nth-child(5)>tbody>tr';
  var assistantProfessors = 'table.menu_default>tbody>tr:nth-child(2)>td>table:nth-child(7)>tbody>tr';
  var retirementProfessors = 'table.menu_default>tbody>tr:nth-child(2)>td>table:nth-child(9)>tbody>tr';

  //Make an array for each Selector
  var professorsArray = professorDepTable(professors, html);
  var associateProfessorsArray = professorDepTable(associateProfessors, html);
  var permantAssistantProfessorsArray = professorDepTable(permantAssistantProfessors, html);
  var assistantProfessorsArray = professorDepTable(assistantProfessors, html);
  var retirementProfessorsArray = professorDepTable(retirementProfessors, html);

  //Concat (Merge) all previous arrays into one
  professorsOfThisCategory = professorsArray.concat(
    associateProfessorsArray,
    permantAssistantProfessorsArray,
    assistantProfessorsArray,
    retirementProfessorsArray);

  //Search for more detauls for each professor
  for (let i = 0; i < professorsOfThisCategory.length; i++) {

    let thisProfessor = professorsOfThisCategory[i]
    //Αν την await την φέρω μέσα σε αυτό το block  θα έχω καλύτερη ταχύτητα.
    var professorFullDetails = await getProfessorProfile(thisProfessor);

    professorsOfThisCategory[i] = professorFullDetails;

    // console.log("name: " + professorsOfThisCategory[i].name);
    // console.log("office: " + professorsOfThisCategory[i].office);
    // console.log();
  }
  return professorsOfThisCategory;
}

var allOtherCategoriesProfessors = async () => {

  //The final Array
  var professorsOfOtherCategories;

  //Make an array from each page
  var pdProfessorsArray = await getOtherCategoryProfessor(urlPd407);
  var postDocProfessorsArray = await getOtherCategoryProfessor(urlPostDoc);
  var otherProfessorsArray = await getOtherCategoryProfessor(ulrOthers);
  var eedipProfessorsArray = await getOtherCategoryProfessor(urlEedip);
  var etepProfessorsArray = await getOtherCategoryProfessor(urlEtep);

  //Concat (Merge) all previous arrays into one
  professorsOfOtherCategories = pdProfessorsArray.concat(
    postDocProfessorsArray,
    otherProfessorsArray,
    eedipProfessorsArray,
    etepProfessorsArray);

  //Search for more detauls for each professor
  for (let i = 0; i < professorsOfOtherCategories.length; i++) {

    let thisProfessor = professorsOfOtherCategories[i]
    //Αν την await την φέρω μέσα σε αυτό το block  θα έχω καλύτερη ταχύτητα.
    var professorFullDetails = await getProfessorProfile(thisProfessor);

    professorsOfOtherCategories[i] = professorFullDetails;

    // console.log("name: " + professorsOfOtherCategories[i].name);
    // console.log("office: " + professorsOfOtherCategories[i].office);
    // console.log();
  }
  return professorsOfOtherCategories;

}

var getOtherCategoryProfessor = async (url) => {
  let html = await requestTo(url);
  //console.log("SWAG");
  //The final Array
  var professorsOfThisCategory;

  var generalSelector = 'table.menu_default>tbody>tr:nth-child(2)>td>table>tbody>tr';

  var splittedLink = splitEqual(url);
  var academicRank = checkAcademicRank(splittedLink[1]);
  var professorsOfThisCategory = otherProfessorsTable(generalSelector, html, academicRank);
  return professorsOfThisCategory;

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

function otherProfessorsTable(selector, html, academicRank) {
  var $ = cheerio.load(html);
  var fullSideListFiltered = $(selector).filter(function() {
    var data = $(this);
    return data;
  });

  const professorsProfieArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr';

  professorsOfThisCategory = fullSideListFiltered.children('td').each(function(i, elem) {
    var data = $(this);
    //console.log("data: " + data);

    var name = data.children().children().text();
    var link = data.children().children().attr('href');
    // console.log("name: " + name);
    // console.log("link: " + link);
    // console.log("AcademicRank: " + academicRank);

    var eachItem = {
      name: name,
      link: icsdDomain + link,
      academicRank: academicRank
    }

    professorsProfieArray.push(eachItem);
  });

  return professorsProfieArray;
}

function professorDepTable(selector, html) {
  var $ = cheerio.load(html);
  var fullSideListFiltered = $(selector).filter(function() {
    var data = $(this);
    return data;
  });

  const professorsProfieArray = [];
  const icsdDomain = 'http://www.icsd.aegean.gr';
  var academicRank = '';
  //console.log("fullSideListFiltered: " + fullSideListFiltered);
  professorsOfThisCategory = fullSideListFiltered.children('td').each(function(i, elem) {
    var data = $(this);

    var professors = data.children().text();
    var link = data.children().children().attr('href');

    //Αν δεν έχει link τότε το professors είναι academicRank
    if (!link) {
      academicRank = checkAcademicRank(professors);
    }
    else {
      var eachItem = {
        name: professors,
        link: icsdDomain + link,
        academicRank: academicRank
      }

      professorsProfieArray.push(eachItem);
    }
  });
  return professorsProfieArray;
}

function checkAcademicRank(receivedString) {
  var academicRank = '';
  switch (receivedString) {
    case 'Καθηγητές':
      academicRank = 'Καθηγητής'
      break;
    case 'Αναπληρωτές Καθηγητές':
      academicRank = 'Αναπληρωτής Καθηγητής'
      break;
    case 'Μόνιμοι Επίκουροι Καθήγητες':
      academicRank = 'Μόνιμος Επίκουρος Καθηγητής'
      break;
    case 'Επίκουροι Καθηγητές':
      academicRank = 'Επίκουρος Καθηγητής'
      break;
    case 'Συνταξιοδοτημένα μέλη ΔΕΠ':
      academicRank = 'Συνταξιοδοτημένο μέλος ΔΕΠ'
      break;
    case 'postdoc':
      academicRank = 'Μεταδιδάκτορας'
      break;
    case 'other':
      academicRank = 'Διδάσκων'
      break;
    case 'eedip':
      academicRank = 'ΕΔΙΠ/ΕΕΠ'
      break;
    case 'etep':
      academicRank = 'ΕΤΕΠ'
      break;
    default:
      academicRank = 'Διδάσκων'
  }
  return academicRank;
}

function splitEqual(receivedMessage) {
  var fields = receivedMessage.split('=');

  return fields;
}

module.exports = {
  getAllProfessors
};

//getAllProfessors();
//allOtherCategoriesProfessors();
//getOtherCategoryProfessor(urlPostDoc);
//getDepCategoryProfessors(urlDep);
