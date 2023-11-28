import { logger } from "../utils/logger.js";
import { HttpResponse } from "../utils/http.response.js"
const httpResponse = new HttpResponse();

import { Router } from "express";
const router = Router ()


router.get('/', (req, res) => {

logger.debug('imprimo debug');
logger.http('imprimo http');
logger.info('imprimo info');
logger.warning('imprimo warning');
logger.error('imprimo error');
logger.fatal('imprimo fatal');

httpResponse.Ok(res, 'logger tested successfully')

});

export default router