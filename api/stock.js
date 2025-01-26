import Database from 'better-sqlite3';
import path from 'path';

// Construct the database path
const dbPath = path.join(process.cwd(), 'frontend', 'db', 'database.sqlite');
const db = new Database(dbPath);

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const rows = db.prepare('SELECT * FROM stock_items').all();
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching stock items:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        const { id, level } = req.body;

        if (!['Low', 'Medium', 'High'].includes(level)) {
            return res.status(400).json({ error: 'Invalid stock level' });
        }

        try {
            const result = db.prepare('UPDATE stock_items SET level = ? WHERE id = ?').run(level, id);
            res.status(200).json({ updated: result.changes });
        } catch (error) {
            console.error('Error updating stock level:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
