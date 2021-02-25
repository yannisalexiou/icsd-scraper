const fetch = require("node-fetch"); //Helps us make HTTP calls
const cheerio = require("cheerio");

var urlICSDHome = "http://www.icsd.aegean.gr/icsd/";

var retrieveStaffLinks = (url) => {
  try {
    const response = await fetch(url);
    const body = await response.text();

    var $ = cheerio.load(body);

      $(".selected").filter(function () {
        var data = $(this);
        console.log(data.next().html());
        // Retrieve the Title of each Staff Category
        const staffArray = [];
        var listOfStaff = data.next().children().last();

        listOfStaff.children("li").each(function (i) {
          staffArray[i] = $(this).text();
        });

        staffArray.join(", ");
        //console.log(staffArray);

        // Retrieve the Href (link) of each Staff Category
        const staffArrayOfHref = [];
        listOfStaff.children("li").each(function (i) {

          var eachItem = {
            staffKind: $(this).children().attr("href")
          }
          staffArrayOfHref[i] = eachItem;

        });
        console.log("staffArrayOfHref:" + staffArrayOfHref[0].staffKind);

        staffArrayOfHref.join(", ");
        //console.log(staffArrayOfHref);

        //Call the helper function to convert it to json
        //icsdStaffCategories(staffArray, staffArrayOfHref);
      });

  } catch (error) {
    console.log(error);
    return error
  }
}

retrieveStaffLinks(urlICSDHome);
