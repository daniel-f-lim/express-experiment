import express from 'express';

const auth_router = express.Router();
import handle_login from '../../controllers/auth_controller.js';

auth_router.post('/', handle_login);

export default auth_router;