import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const user_data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'model', 'users.json')));
const usersDB = {
	users: user_data,
	set_users: function(data) { this.users = data }
};

export const handle_logout = (req, res) => {
	console.log('handling logout');
	const cookies = req.cookies;
	if (!cookies?.refresh_token) return res.sendStatus(204);
	const refresh_token = cookies.refresh_token;

	const found = usersDB.users.find(person => person.refresh_token === refresh_token);
	if (!found) {
		return res.sendStatus(204);
	}

	const others = usersDB.users.filter(person => person.refresh_token !== found.refresh_token);
	const current_user = {...found, refresh_token: ''};
	usersDB.set_users([...others, current_user]);
	fs.writeFileSync(
		path.join(__dirname, '..', 'model', 'users.json'),
		JSON.stringify(usersDB.users)
	);

	res.clearCookie('refresh_token',
			{
				httpOnly: true,
				sameSite: 'None',
				secure: true
			});
	res.sendStatus(204);
}