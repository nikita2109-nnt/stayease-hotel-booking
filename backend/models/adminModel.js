
const pool = require("../config/db");

const getAdminByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT id, username, password_hash, is_active
     FROM admins
     WHERE username = ?
     LIMIT 1`,
    [username]
  );

  return rows.length > 0 ? rows[0] : null;
};

module.exports = {
  getAdminByUsername
};
