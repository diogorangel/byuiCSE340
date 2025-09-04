const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Add Inventory rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [
    // valid inventory is required and cannot already exist in the DB
    body("classification_id")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please select a valid car classification"),
    body("inv_make")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide valid car maker"),
    body("inv_model")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide valid car model"),
    body("inv_description")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a short description"),
    body("inv_image")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a link to the vehicle image"),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a link to the vehicle image thumbnail"),
    body("inv_price")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid price")
      .custom(async (inv_price) => {
        if (!inv_price.match(/^\d+$/)) {
          throw new Error("Only digits allowed.");
        }
      }),
    body("inv_year")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 4 })
      .withMessage("Please provide a valid four digits year")
      .custom(async (inv_year) => {
        if (!inv_year.match(/^\d+$/)) {
          throw new Error("Please provide 4 digits year");
        }
      }),
    body("inv_miles")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a valid number of miles")
      .custom(async (inv_miles) => {
        if (!inv_miles.match(/^\d+$/)) {
          throw new Error("Please provide a numeric value");
        }
      }),
    body("inv_color")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a valid color"),
  ];
};

/*  **********************************
 *  Add New Inventory rules
 * ********************************* */
validate.addNewInventoryRules = () => {
  return [
    // valid inventory is required and cannot already exist in the DB
    
    body("classification_id")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please select a valid car classification"),
    body("inv_id")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please select a valid car id"),
    body("inv_make")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide valid car maker"),
    body("inv_model")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide valid car model"),
    body("inv_description")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a short description"),
    body("inv_image")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a link to the vehicle image"),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a link to the vehicle image thumbnail"),
    body("inv_price")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid price")
      .custom(async (inv_price) => {
        if (!inv_price.match(/^\d+$/)) {
          throw new Error("Only digits allowed.");
        }
      }),
    body("inv_year")
      .trim()
      .notEmpty()
      .escape()
      .isLength({ min: 4 })
      .withMessage("Please provide a valid four digits year")
      .custom(async (inv_year) => {
        if (!inv_year.match(/^\d+$/)) {
          throw new Error("Please provide 4 digits year");
        }
      }),
    body("inv_miles")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a valid number of miles")
      .custom(async (inv_miles) => {
        if (!inv_miles.match(/^\d+$/)) {
          throw new Error("Please provide a numeric value");
        }
      }),
    body("inv_color")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("Please provide a valid color"),
  ];
};

/*  **********************************
 *  Check inventory data
 * ********************************* */

validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Check update data
 * ********************************* */

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Mechanic Special",
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = validate;
