import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'frontend', 'db', 'db.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Read the JSON file and return the stock items
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading database:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            const db = JSON.parse(data);
            res.status(200).json(db.stock_items);
        });
    } else if (req.method === 'POST') {
        // Update a stock item's level
        const { id, level } = req.body;

        if (!['Low', 'Medium', 'High'].includes(level)) {
            res.status(400).json({ error: 'Invalid stock level' });
            return;
        }

        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading database:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            const db = JSON.parse(data);
            const item = db.stock_items.find((item) => item.id === id);

            if (!item) {
                res.status(404).json({ error: 'Stock item not found' });
                return;
            }

            item.level = level;

            fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to database:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                res.status(200).json({ updated: true });
            });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
