const utilities = require(".");
const vehicleModel = require("../models/vehicle-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Inquiry Validation Rules
 * ********************************* */
validate.InquiryRules = () => {
  return [
    // firstname is required and must be string
    body("inquiry_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("inquiry_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("inquiry_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
    // valid email is required and cannot already exist in the DB
    body("inquiry_message")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a message.")// on error this message is sent.
  ];
};

/* ******************************
 * Check inquiry data and return errors
 * ***************************** */
validate.checkInquiryData = async (req, res, next) => {
  const { inquiry_firstname, inquiry_lastname, inquiry_email, inquiry_message, inv_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const data = await vehicleModel.getvehicleById(inv_id);
    const carDetailsGrid = await utilities.buildSingleVehiclePage(data, res.locals.accountData);
    res.render("inventory/vehicle", {
      title: "Your Car",
      nav,
      inquiry_firstname,
      inquiry_lastname,
      inquiry_email,
      inquiry_message,
      inv_id,
      carDetailsGrid,
      errors,
    });
    return;
  }
  next();
};

module.exports = validate;