const utilities = require("../utilities/");
const classificationModel = require("../models/classification-model");

const insertClassification = async (req, res) => {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const result = await classificationModel.insertClassification(
    classification_name
  );
  if (result) {
    req.flash(
      "notice",
      `Congratulations, you have added ${classification_name} to the database.`
    );
    res.status(201).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the insertion failed.");
    res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

module.exports = { insertClassification };
