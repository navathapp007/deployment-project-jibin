const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   DB CONNECTION
========================= */
const db = mysql.createConnection({
  host: "localhost",        // DB is on same EC2
  user: "appuser",             // your MariaDB user
  password: "admin123",        // 🔥 replace with your actual password
  database: "myapp"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to MariaDB");
  }
});

/* =========================
   API ROUTES
========================= */

// ✅ GET all items
app.get('/api/items', (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch items" });
    }
    res.json(results);
  });
});

// ✅ POST new item
app.post('/api/items', (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  db.query(
    "INSERT INTO items (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        console.error("❌ Insert error:", err);
        return res.status(500).json({ error: "Failed to insert item" });
      }

      res.json({
        id: result.insertId,
        name: name
      });
    }
  );
});

/* =========================
   SERVER
========================= */
const PORT = 3001;

// 🔥 IMPORTANT: listen on all IPs for EC2 access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
