import express from 'express';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root_router = express.Router();

root_router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

root_router.get('/old', (req, res) => {
	res.redirect(301, '/');
});

export default root_router;