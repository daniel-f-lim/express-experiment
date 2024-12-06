import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const verify_jwt = (req, res, next) => {
	const auth_header = req.headers['authorization'];
	if (!auth_header?.startsWith('Bearer')) return res.status(401).json({ 'message': 'No Authorization Header' });

	console.log(auth_header);
	const token = auth_header.split(' ')[1];
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(err, decoded) => {
			if (err) return res.status(403).json({ 'message': 'Faulty Access Token' });
			req.user = decoded.userinfo.username;
			req.roles = decoded.userinfo.roles;
			next();
		}
	)
}

export default verify_jwt;