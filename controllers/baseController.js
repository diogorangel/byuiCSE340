const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    next(error);
  }
};

baseController.throwError = async function (req, res, next) {
  // Intencionalmente lança um erro para testar o manipulador de erro 500
  throw new Error("This is an intentional 500 server error.");
};

module.exports = baseController;