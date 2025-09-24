// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invVehicle = require("../controllers/vehicleController");
const utilities = require("../utilities");
const validate = require("../utilities/classification-validation");
const inventoryValidate = require("../utilities/addinventory-validation");
const classificationController = require("../controllers/classificationController");
const classificationControllerC = require("../controllers/classificationControllerC");
const selectController = require("../controllers/selectController");
const inquiryValidate = require("../utilities/inquiry-validation");
const inquiryController = require("../controllers/inquiryController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build car model details view
router.get("/detail/:carModelId", invVehicle.buildSingleVehicle);
// Route to add classification
router.get(
  "/add-classification",
  //utilities.checkAccountType,
  classificationController.addClassification
);
// Route to add inventory
router.get(
  "/add-inventory",
  //utilities.checkAccountType,
  selectController.buildDropdown
);

// Route to classification
router.post(
  "/add-classification",
  //utilities.checkAccountType,
  validate.classificationRules(),
  validate.checkClassifData,
  utilities.handleErrors(classificationControllerC.insertClassification)
);

// Route to add inventory
router.post(
  "/add-inventory",
  //utilities.checkAccountType,
  inventoryValidate.addInventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(selectController.insertInventory)
);

// Route to account management view
router.get(
  "/",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView));

// Route to inventory
router.get(
  "/getInventory/:classification_id",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to inventory management
router.get(
  "/edit/:inv_id",
  //utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

// Route to update vehicle
router.post(
  "/update/",
  //utilities.checkAccountType,
  inventoryValidate.addNewInventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory));

// Route to inquiry
router.post(
  "/inquiry/",
  utilities.checkLogin,
  inquiryValidate.InquiryRules(),
  inquiryValidate.checkInquiryData,
  utilities.handleErrors(inquiryController.registerInquiry));

module.exports = router;
