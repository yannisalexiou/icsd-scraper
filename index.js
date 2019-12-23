const professor = require("./professors/members");
const semester = require("./courses/semester");
const course = require("./courses/course");

async function getProfessors() {
  console.log("Please wait...");
  var allProfessors = await professor.getAllProfessors();

  return allProfessors;
}

async function getBasicCourses() {
  console.log("Please wait...");
  var isBasic = true;
  var allCourses = await semester.checkSemesters(isBasic);

  return allCourses;
}

async function getAdvancedCourses() {
  console.log("Please wait...");
  var isBasic = false;
  var allCourses = await semester.checkSemesters(isBasic);

  return allCourses;
}

async function getAdvancedCourseDetails(url) {
  console.log("Please wait...");
  var courseAdvancedDetails = await course.getAdvancedCourseDetails(url);

  return courseAdvancedDetails;
}

module.exports = {
  getProfessors,
  getBasicCourses,
  getAdvancedCourses,
  getAdvancedCourseDetails
};
