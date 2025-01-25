import sqlite3 from 'sqlite3';
import path from 'path';

const db = new sqlite3.Database(path.resolve('./backend/db/database.sqlite'));

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
