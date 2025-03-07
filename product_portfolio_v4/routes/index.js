import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Fix __dirname (since it's not available in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the homepage
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});



// Serve the Contact page
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/contact.html'));
});

router.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/products.html'));
});

router.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/events.html'));
});



export default router; // Use export instead of module.exports
