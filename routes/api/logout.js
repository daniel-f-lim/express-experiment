import express from 'express';

const logout_router = express.Router();
import { handle_logout } from '../../controllers/logout_controller.js';

logout_router.get('/', handle_logout);

export default logout_router;