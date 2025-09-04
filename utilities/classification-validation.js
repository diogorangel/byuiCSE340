const utilities = require(".");
const { body, validationResult } = require("express-validator");
const classificationModel = require("../models/classification-model");
const validate = {};

/*  **********************************
 *  Classification rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // valid classification is required and cannot already exist in the DB
    body("classification_name")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("A valid classification name is required.")
      .custom(async (classification_name) => {
        if (!classification_name.match(/^\S+$/)) {
          throw new Error("No white space is allowed.");
        }
        if (!classification_name.match(/^[a-zA-Z]+$/)) {
          throw new Error("Only alphabethical characters.");
        }
      })
      .custom(async (classification_name) => {
        const classificationName =
          await classificationModel.checkExistingClassification(
            classification_name
          );
        if (classificationName) {
          throw new Error("Classification name already exists.");
        }
      }),
  ];
};

/*  **********************************
 *  Check classification data
 * ********************************* */

validate.checkClassifData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

module.exports = validate;
