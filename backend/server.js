const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./backend/db/database.sqlite');

const cors = require('cors');
app.use(cors());


app.use(express.json());

// Basic API to test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

app.get('/api/stock', (req, res) => {
    db.all('SELECT * FROM stock_items', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});


app.post('/api/stock/:id', (req, res) => {
    const { id } = req.params;
    const { level } = req.body;

    if (!['Low', 'Medium', 'High'].includes(level)) {
        return res.status(400).json({ error: 'Invalid stock level' });
    }

    db.run(
        'UPDATE stock_items SET level = ? WHERE id = ?',
        [level, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ updated: this.changes });
            }
        }
    );
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

