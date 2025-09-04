const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getvehicleById(inv_id) {
  let dataVehicle = await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [inv_id]
  );
  return dataVehicle.rows[0];
}

module.exports = { getvehicleById };
