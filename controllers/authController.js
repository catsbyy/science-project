const bcrypt = require("bcrypt");
const db = require("../models/db.js"); // Import the db module if needed
const connectionPromise = require("../app.js").connection;
const saltRounds = 10;

exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  try {
    const results = await connectionPromise(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Internal server error." });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          company_name: user.company_name,
        },
      });

      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    });
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.registerUser = async function (req, res) {
  const { name, surname, email, password, role, company_name } = req.body;

  if (!name || !surname || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    const query =
      "INSERT INTO users (name, surname, email, password, role, company_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
    const values = [name, surname, email, hash, role, company_name];

    try {
      await connectionPromise(query, values);
      res.json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Error inserting user into database:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });
};
