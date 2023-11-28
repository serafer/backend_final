import { connect } from 'mongoose';
import config from '../../../utils/config.js'
import { logger } from '../../../utils/logger.js';


//const connectionString = config.MONGO_LOCAL_URL;

export const connectionString = config.MONGO_ATLAS_URL;

export const conectionMongoose = async () => {

    try {
        await connect(connectionString)
        logger.http('Conectado a Mongoose connection')
    } catch (error) {
        logger.fatal(error);
    }
    
}