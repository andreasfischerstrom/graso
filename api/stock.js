import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lsubvjnjdgdjvyuokubr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdWJ2am5qZGdkanZ5dW9rdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMzU3ODQsImV4cCI6MjA1MzcxMTc4NH0.gmA9k4jWm49vcTOYp-YxIsH62nzr7l7zqak77ensYN0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        console.log("Fetching stock items...");
        const { data, error } = await supabase.from('stock_items').select('*');

        if (error) {
            console.error('Error fetching stock:', error);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(data);
    } 
    
    else if (req.method === 'POST') {
        console.log("Received POST request:", req.body);

        const { id, level } = req.body;

        if (!id || !['Low', 'Medium', 'High'].includes(level)) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const { error } = await supabase
            .from('stock_items')
            .update({ level })
            .eq('id', id);

        if (error) {
            console.error('Error updating stock:', error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`Stock item ${id} updated to ${level}`);
        return res.status(200).json({ message: 'Stock item updated' });
    } 
    
    else {
        console.error(`Method ${req.method} not allowed`);
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
