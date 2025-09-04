const utilities = require("../utilities/");
const classificationCont = {};

classificationCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

module.exports = classificationCont;
