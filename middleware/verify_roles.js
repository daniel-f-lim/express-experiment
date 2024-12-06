const verify_roles = (...allowed_roles) => {
	return (req, res, next) => {
		if (!req?.roles) return res.sendStatus(401);
		const roles = [...allowed_roles];
		console.log(roles);
		console.log(req.roles);
		const result = req.roles.map(role => roles.includes(role)).find(val => val === true);
		if (!result) return res.sendStatus(401);
		next();
	}
}

export default verify_roles;