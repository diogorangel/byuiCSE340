/* ***********************************
 * Inquiry controller
 * ******************************** */
const utilities = require("../utilities");
const inquiryModel = require("../models/inquiry-model");
const vehicleModel = require("../models/vehicle-model");
require("dotenv").config();


/* ****************************************
 *  Process Inquiry
 * *************************************** */
async function registerInquiry(req, res) {
  let nav = await utilities.getNav();
  const {
    inquiry_firstname,
    inquiry_lastname,
    inquiry_email,
    inquiry_message,
    inv_id,
  } = req.body;
  const regInquiry = await inquiryModel.registerInquiry(
    inquiry_firstname,
    inquiry_lastname,
    inquiry_email,
    inquiry_message,
    inv_id,
  );
  if (regInquiry) {
    req.flash(
      "notice",
      `Great, ${inquiry_firstname}, Your inquiry has been sent. A member of the team will contact you in the next 24 hours.`
    );
    let nav = await utilities.getNav();
    const data = await vehicleModel.getvehicleById(inv_id);
    const carDetailsGrid = await utilities.buildSingleVehiclePage(data, res.locals.accountData);
    res.status(201).render("inventory/vehicle", {
      title: "Your Car",
      nav,
      inquiry_firstname,
      inquiry_lastname,
      inquiry_email,
      inquiry_message,
      inv_id,
      carDetailsGrid,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, your inquiry submission failed.");
    let nav = await utilities.getNav();
    const data = await vehicleModel.getvehicleById(inv_id);
    const carDetailsGrid = await utilities.buildSingleVehiclePage(data, res.locals.accountData);
    res.status(501).render("inventory/vehicle", {
      title: "Your Car",
      nav,
      inquiry_firstname,
      inquiry_lastname,
      inquiry_email,
      inquiry_message,
      inv_id,
      carDetailsGrid,
      errors: null,
    });
  }
}

module.exports = {
  registerInquiry,
};