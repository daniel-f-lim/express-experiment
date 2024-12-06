import express from 'express';

const refresh_router = express.Router();
import handle_refresh from '../../controllers/refresh_controller.js';

refresh_router.get('/', handle_refresh);

export default refresh_router;