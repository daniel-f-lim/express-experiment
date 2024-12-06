const error_handler = (err, req, res, next) => {
	console.error(err);
	res.status(500).send(err.message);
}

export default error_handler;