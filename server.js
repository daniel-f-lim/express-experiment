// https://www.youtube.com/watch?v=Zh7psmf1KAA&list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw&index=8

import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors';
import cors_options from './config/cors_options.js';

import error_handler from './middleware/error_handler.js';
import verify_jwt from './middleware/verify_jwt.js';
import credentials from './middleware/credentials.js';

import root_router from './routes/root.js';
import auth_router from './routes/api/auth.js';
import logout_router from './routes/api/logout.js';
import refresh_router from './routes/api/refresh.js';
import register_router from './routes/api/register.js';
import api_sdlp_report_split_router from './routes/api/sdlp/api_sdlp_report_split_router.js';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const upload = multer({ storage });

const server = express();
const port = 3000;

const nodeEnv = process.env.NODE_ENV ?? 'development';
console.log('Node Env', nodeEnv);


// CUSTOM MIDDLEWARE
server.use(credentials);

// BUILT-IN MIDDLEWARE
server.use(cors(cors_options));
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({extended: true}))

// STATIC FILE SERVING
server.use('/', express.static(path.join(__dirname, '/public')));
server.use('/api', express.static(path.join(__dirname, '/public')));

// ROUTES
server.use('/', root_router);
server.use('/login', auth_router);
server.use('/logout', logout_router);
server.use('/refresh', refresh_router);
server.use('/register', register_router);

server.use(verify_jwt);
server.use('/api/sdlp/report_split', api_sdlp_report_split_router);

server.all('*', (req, res) => {
	res.status(404);

	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	}
	else if (req.accepts('json')) {
		res.json({ error: '404 Not Found' });
	}
	else {
		res.type('txt'.send('404 Not Found'));
	}
});

server.use(error_handler);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default server;