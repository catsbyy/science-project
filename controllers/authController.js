const bcrypt = require('bcrypt');
const connection = require('../app.js').connection;
const db = require('../models/db.js');
const dbHelper = new db();
const saltRounds = 10;

exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = results[0];

    // Assuming passwords are stored as hashed values in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          company_name: user.company_name, // Added company_name
        },
      });
    });
  });
};

exports.registerUser = async function (req, res) {
  const { name, surname, email, password, role, company_name } = req.body;

  if (!name || !surname || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    const query =
      'INSERT INTO users (name, surname, email, password, role, company_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';
    const values = [name, surname, email, hash, role, company_name];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
      }

      res.json({ message: 'User registered successfully' });
    });
  });
};
