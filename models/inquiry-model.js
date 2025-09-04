const pool = require("../database/");



/* ****************************************
 *   Insert new classification inside the database
 * ************************************* */
async function registerInquiry(
    inquiry_firstname,
    inquiry_lastname,
    inquiry_email,
    inquiry_message,
    inv_id
) {
  try {
    const sql =
      "INSERT INTO inquiry (inquiry_firstname, inquiry_lastname, inquiry_email, inquiry_message, vehicle_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    return await pool.query(sql, [
    inquiry_firstname,
    inquiry_lastname,
    inquiry_email,
    inquiry_message,
    inv_id
    ]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerInquiry };
