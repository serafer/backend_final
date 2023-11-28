import "dotenv/config";

export default {
    
    PORT: process.env.PORT,
    DB :  process.env.DB,

    MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL,
    MONGO_LOCAL_URL: process.env.MONGO_LOCAL_URL,

    PERSISTENCE: process.env.PERSISTENCE,

    SECRET_KEY_JWT : process.env.SECRET_KEY_JWT,

    
    PORT_ETHEREAL : process.env.PORT_ETHEREAL,
    EMAIL : process.env.EMAIL_ETHEREAL,
    PASSWORD : process.env.PASSWORD_ETHEREAL,
    NAME : process.env.NAME_ETHEREAL,
    HOST : process.env.HOST_ETHEREAL,

    EMAIL_GMAIL : process.env.EMAIL_GMAIL,
    PASSWORD_GMAIL : process.env.PASSWORD_GMAIL,


    TWILIO_PHONE : process.env.TWILIO_PHONE,
    TWILIO_SID : process.env.TWILIO_SID,
    TWILIO_TOKEN : process.env.TWILIO_TOKEN,

    EMAIL_TEST: process.env.EMAIL_TEST,
    PASSWORD_TEST: process.env.PASSWORD_TEST


}
