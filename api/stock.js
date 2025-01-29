import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lsubvjnjdgdjvyuokubr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdWJ2am5qZGdkanZ5dW9rdWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMzU3ODQsImV4cCI6MjA1MzcxMTc4NH0.gmA9k4jWm49vcTOYp-YxIsH62nzr7l7zqak77ensYN0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        console.log("Fetching stock items..."); // Debug log

        const { data, error } = await supabase.from('stock_items').select('*');

        console.log("Data received from Supabase:", data); // Debug log
        console.log("Error from Supabase:", error); // Debug log

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
