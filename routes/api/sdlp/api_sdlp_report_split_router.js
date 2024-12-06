import express from 'express';
import verify_jwt from '../../../middleware/verify_jwt.js'

const api_sdlp_report_split_router = express.Router();
import { get_sdlp_report_split } from '../../../controllers/sdlp_report_split_controller.js';

import ROLES_LIST from '../../../config/roles_list.js';
import verify_roles from '../../../middleware/verify_roles.js';

api_sdlp_report_split_router.route('/')
	.get(verify_roles(ROLES_LIST.User), get_sdlp_report_split)
	.post((req, res) => {
		res.json({
			"firstname": req.body.firstname,
			"lastname": req.body.lastname
		});
	})
	.put((req, res) => {
		res.json({
			"firstname": req.body.firstname,
			"lastname": req.body.lastname
		});
	})
	.delete((req, res) => {
		res.json({ "id": req.body.id })
	});

api_sdlp_report_split_router.route('/:id')
	.get((req, res) => {
		res.json({ "id": req.params.id });
	})


export default api_sdlp_report_split_router;