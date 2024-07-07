const connection = require("../app.js").connection;
const db = require("../models/db.js");
const dbHelper = new db();
const bcrypt = require("bcrypt"); // Add bcrypt for password hashing

exports.updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, companyName, currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Fetch the user to check the current password
    const userQuery = "SELECT password FROM users WHERE id = ?";
    const user = await connection(userQuery, [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentPassword && newPassword && confirmPassword) {
      // Check if the current password is correct
      const passwordMatch = await bcrypt.compare(currentPassword, user[0].password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user details along with the new password
      const query = `
        UPDATE users 
        SET name = ?, surname = ?, email = ?, company_name = ?, password = ?
        WHERE id = ?
      `;
      await connection(query, [name, surname, email, companyName || null, hashedPassword, id]);
    } else {
      // Update the user details without changing the password
      const query = `
        UPDATE users 
        SET name = ?, surname = ?, email = ?, company_name = ?
        WHERE id = ?
      `;
      await connection(query, [name, surname, email, companyName || null, id]);
    }

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Failed to update user details:", error);
    res.status(500).json({ message: "Failed to update user details", error });
  }
};
