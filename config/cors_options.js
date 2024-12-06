import allowed_origins from './allowed_origins.js';

const cors_options = {
	origin: (origin, callback) => {
		// console.log('origin', origin);
		if (allowed_origins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		}
		else {
			callback(new Error('Not allowed by CORS'));
		}
	}
}

export default cors_options;