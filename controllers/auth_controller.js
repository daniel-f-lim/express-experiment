import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

const handle_login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required' });

	const found = usersDB.users.find(person => person.username === username);
	if (!found) return res.status(401).json({ 'message': `User ${username} does not exist` });

	const match = await bcrypt.compare(password, found.password);
	if (match) {
		const roles = Object.values(found.roles);
		// JWT ACCESS / REFRESH TOKENS
		// require('crypto').randomBytes(64).toString('hex')
		const access_token = jwt.sign(
			{
				"userinfo": {
					"username": found.username,
					"roles": roles
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);

		const refresh_token = jwt.sign(
			{ "username": found.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		const others = usersDB.users.filter(person => person.username !== found.username);
		const current_user = {...found, refresh_token };
		usersDB.set_users([...others, current_user]);

		fs.writeFileSync(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(usersDB.users)
		);

		res.cookie('refresh_token', refresh_token,
			{
				httpOnly: true,
				sameSite: 'None',
				secure: true,
				maxAge: 24 * 60 * 60 * 1000
			}); // secure: true - for https
		res.json({
			'message': `User ${username} successful login`,
			access_token
		});
	}
	else {
		res.status(401).json({ 'message': `Bad username/password combination` });
	}
}

export default handle_login;