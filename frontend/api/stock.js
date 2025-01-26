import sqlite3 from 'sqlite3';
import path from 'path';

// Use an absolute path to access the database
const db = new sqlite3.Database(path.resolve('./db/database.sqlite'));

// Ensure the table exists and seed data if necessary
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS stock_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            level TEXT CHECK(level IN ('Low', 'Medium', 'High')) NOT NULL DEFAULT 'Medium'
        )`
    );

    db.all('SELECT COUNT(*) AS count FROM stock_items', (err, rows) => {
        if (err) {
            console.error('Error checking stock items:', err);
        } else if (rows[0].count === 0) {
            // Seed the table with initial data if it's empty
            db.run(
                `INSERT INTO stock_items (name, level) VALUES 
                ('Toilet Paper', 'High'), 
                ('Dish Soap', 'Medium'), 
                ('Coffee', 'Low'), 
                ('Batteries', 'High')`
            );
        }
    });
});

export default function handler(req, res) {
    if (req.method === 'GET') {
        db.all('SELECT * FROM stock_items', [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
    } else if (req.method === 'POST') {
        const { id, level } = req.body;

        if (!['Low', 'Medium', 'High'].includes(level)) {
            return res.status(400).json({ error: 'Invalid stock level' });
        }

        db.run('UPDATE stock_items SET level = ? WHERE id = ?', [level, id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ updated: this.changes });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
