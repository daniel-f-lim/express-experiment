import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const user_data = JSON.parse(fs.readFileSync('model/users.json'));

const usersDB = {
	users: user_data,
	set_users: function(data) { this.users = data }
}

export const handle_new_user = async (req, res) => {
	const { user, pass } = req.body;
	if (!user || !pass) return res.status(400).json({ 'message': 'Username and password are required' });

	const duplicate = usersDB.users.find(person => person.username === user);
	if (duplicate) return res.status(409).json({ 'message': `Duplicate username: ${user}` });

	try {
		const hashed_pass = await bcrypt.hash(pass, 10);
		const new_user = {
			"username": user,
			"password": hashed_pass,
			"roles": { "User": 2001 },
		};
		usersDB.set_users([...usersDB.users, new_user]);
		fs.writeFileSync(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
		console.log(usersDB.users);
		res.status(201).json({ 'message': `New user ${user} created` });
	}
	catch (err) {
		res.status(500).json({ 'message': err.message });
	}
}