import express from 'express';

const register_router = express.Router();
import { handle_new_user } from '../../controllers/register_controller.js';

register_router.post('/', handle_new_user);

export default register_router;