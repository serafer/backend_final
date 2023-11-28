import { Router } from "express";
import { sendSMS } from "../controllers/smsControllers.js";
const router = Router ()


router.post('/', sendSMS);

export default router