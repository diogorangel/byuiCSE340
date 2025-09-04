const utilities = require("../utilities/");
const inventoryModel = require("../models/inventory-model");

async function buildDropdown(req, res) {
  const selectMenu = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    selectMenu,
    nav,
    errors: null,
  });
}

const insertInventory = async (req, res) => {
  let nav = await utilities.getNav();
  const selectMenu = await utilities.buildClassificationList();
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
  const result = await inventoryModel.insertInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );
  if (result) {
    req.flash(
      "notice",
      `Congratulations, you have added ${inv_make} ${inv_model} to the database.`
    );
    res.status(201).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      selectMenu,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the insertion failed.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      selectMenu,
      errors: null,
    });
  }
};

module.exports = { insertInventory, buildDropdown };
