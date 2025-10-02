const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  
  // CORREÇÃO: Verifica se há dados antes de tentar acessar data[0]
  if (!data || data.length === 0) {
    // Se nenhum item for encontrado, lança um erro 404
    let nav = await utilities.getNav();
    // Você pode preferir um erro 404
    return res.status(404).render("errors/error", {
      title: "404 - Not Found",
      message: "Sorry, we don't found it.",
      nav,
      errors: null,
    });
  }
  
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  
  // Acessa de forma segura a propriedade, agora que sabemos que data[0] existe
  const className = data[0].classification_name;
  
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    errors: null,
    grid,
  });
};

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const selectMenu = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    selectMenu,
    errors: null,
  });
};

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  
  // CORREÇÃO: Verifica se há dados antes de tentar acessar invData[0]
  if (invData && invData.length > 0) {
    return res.json(invData);
  } else {
    // Retorna um status 404 ou 204 se nenhum dado for encontrado para a classificação
    return res.status(204).json([]);
  }
};

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  
  // Obtém o primeiro item do array retornado ou trata como array vazio se falhar
  const itemData = (await invModel.getInventoryById(inv_id))[0];
  
  if (!itemData) {
     // Lidar com item não encontrado
     let nav = await utilities.getNav();
     return res.status(404).render("errors/error", {
      title: "404 - Not Found",
      message: "Sorry, we don't found it.",
      nav,
      errors: null,
    });
  }

  const selectMenu = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    selectMenu,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 * Process edit inventory submission
 * ************************** */
const editInventory = async (req, res) => {
  let nav = await utilities.getNav();
  const selectMenu = await utilities.buildClassificationList();
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
  
  // CORREÇÃO: Alterado de 'inventoryModel' para 'invModel'
  const result = await invModel.updateInventory(
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
    classification_id
  );
  
  if (result) {
    req.flash(
      "notice",
      `Congratulations, you have modified ${inv_make} ${inv_model} to the database.`
    );
    res.redirect("/inv/")
  } else {
    // Se a atualização falhar, re-renderiza a página com os dados originais
    // para que o usuário não perca o que digitou.
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model, // Título dinâmico
      nav,
      selectMenu,
      errors: null,
      // Passa os dados do corpo da requisição de volta para o formulário
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

// Adiciona a nova função ao objeto de exportação
invCont.editInventory = editInventory;

module.exports = invCont;