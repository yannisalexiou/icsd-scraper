const professor = require('./professors/members');
const course = require('./courses/semester');

async function getProfessors() {
  var allProfessors = await professor.getAllProfessors();
  console.log("Professors", allProfessors);
  return allProfessors;
}

async function getBasicCourses() {
  var isBasic = true;
  var allCourses = await course.checkSemesters(isBasic);
  console.log("allCourses", allCourses);
  return allCourses;
}

async function getAdvancedCourses() {
  var isBasic = false;
  var allCourses = await course.checkSemesters(isBasic);

  return allCourses;
}

getBasicCourses();
// getProfessors();

module.exports = {
  getProfessors,
  getBasicCourses,
  getAdvancedCourses
};
