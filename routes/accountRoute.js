/* ***********************************
 * Account routes
 * deliver login view activity
 * ******************************** */
// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ***********************************
 * Deliver Login View
 * deliver login view activity
 * ******************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* ***********************************
 * Deliver Registration View
 * deliver registration view activity
 * ******************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* ***********************************
 * Process Registration
 * process registration activity
 * ******************************** */
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ***********************************
 * Deliver Account Management View
 * ******************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

/* ***********************************
 * Deliver Update Account View
 * ******************************** */
router.get(
  "/update",
  utilities.handleErrors(accountController.buildUpdate)
);

router.post(
  "/updateAccount",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/updatePassword",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
);

router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router;
