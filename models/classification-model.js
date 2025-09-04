const pool = require("../database/");

/* ****************************************
 *   Check for existing classification name
 * ************************************* */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ****************************************
 *   Insert new classification inside the database
 * ************************************* */
async function insertClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { checkExistingClassification, insertClassification };
