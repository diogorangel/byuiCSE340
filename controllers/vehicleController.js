const vehicleModel = require("../models/vehicle-model");
const utilities = require("../utilities/");

const vehicleCont = {};

/* ***************************
 *  Build vehicle details
 * ************************** */
vehicleCont.buildSingleVehicle = async function (req, res, next) {
  const inv_id = req.params.carModelId;
  const data = await vehicleModel.getvehicleById(inv_id);
  const carDetailsGrid = await utilities.buildSingleVehiclePage(data, res.locals.accountData);
  let nav = await utilities.getNav();
  res.render("inventory/vehicle", {
    title: "Your Car",
    nav,
    carDetailsGrid,
    errors: null,
  });
};

module.exports = vehicleCont;
