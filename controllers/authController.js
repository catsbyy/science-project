const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db.js");
const connectionPromise = require("../app.js").connection;
const saltRounds = 10;
const secretKey = "your_secret_key"; // Should be stored securely in environment variables

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

      const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, secretKey, {
        expiresIn: "30d",
      });

      res.cookie("token", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // Set cookie for 30 days

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

exports.checkUser = async function (req, res) {
  const userId = req.user.id; // Extract user ID from the token
  const query = "SELECT id, name, surname, email, role, company_name FROM users WHERE id = ?";

  try {
    const results = await connectionPromise(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    res.json({
      message: "User authenticated",
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        company_name: user.company_name,
        isAuthenticated: true,
      },
    });
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
