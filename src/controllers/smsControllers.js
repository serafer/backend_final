import config from "../utils/config.js";
import { twilioClient } from "../services/smsServices.js";
import { HttpResponse } from "../utils/http.response.js"
const httpResponse = new HttpResponse();

export const sendSMS = async (req, res, next) => {
    try {
        const message = {
            body: req.body.message,
            from: config.TWILIO_PHONE,
            to: req.body.dest
        };
        const response = await twilioClient.messages.create(message);
        return httpResponse.Ok(res, response)
    } catch (error) {
        next(error.message);
    }
}