import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

import * as dotenv from 'dotenv';
dotenv.config();

const user_data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'model', 'users.json')));
const usersDB = {
	users: user_data,
	set_users: function(data) { this.users = data }
};

const handle_refresh = (req, res) => {
	console.log('handle refresh');
	const cookies = req.cookies;
	if (!cookies?.refresh_token) return res.status(401).json({ 'message': 'No cookies or refresh token' });

	const refresh_token = cookies.refresh_token;

	const found = usersDB.users.find(person => person.refresh_token === refresh_token);
	if (!found) return res.status(403).json({ 'message': `Refresh token not found` });

	jwt.verify(
		refresh_token,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if (err || found.username !== decoded.username) return res.status(403).json({ 'message': 'Invalid refresh token' });
			const roles = Object.values(found.roles);
			const access_token = jwt.sign(
				{ 
					'userinfo': {
						'username': decoded.username,
						'roles': roles
					}
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '30s' }
			);
			res.json({ 'message': 'Successfully refreshed access token', access_token });
		}
	);
}

export default handle_refresh;