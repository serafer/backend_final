//-------- SOLO FUNCIONA COMO SWITCH PARA LA BASE DE DATOS --------//
//-------- Queda preparado para una futura migración a class --------//
//-------- la persistencia en FS, no posee funcionalidad --------//


import { logger } from '../../utils/logger.js';

//------ Mongo ------//
import * as productDaoMongo from './mongodb/productDaoMongo.js'
import * as userDaoMongo from './mongodb/userDaoMongo.js'
//import * as chatDaoMongo from './mongodb/chatDaoMongo.js'
import * as cartDaoMongo from './mongodb/cartDaoMongo.js'
import { conectionMongoose } from "./mongodb/conection.js";


//------ FS ------//
import * as productDaoFS from './filesystem/productDaoFS.js'
import * as userDaoFS from './filesystem/userDaoFS.js'
//import * as chatDaoFS from './filesystem/chatDaoFS.js'
import * as cartDaoFS from './filesystem/cartDaoFS.js'





let userDao;
let prodDao;
let chatDao;
let cartDao;

let persistence = process.argv[3] || 'mongo'


switch (persistence) {
    case 'file':
        userDao = userDaoFS
        prodDao = productDaoFS
        //chatDao = chatDaoFS
        cartDao = cartDaoFS
        logger.info('Persistence: ' + persistence);
        break;
    case 'mongo':
        await conectionMongoose();
        userDao = userDaoMongo
        prodDao = productDaoMongo;
        //chatDao = chatDaoMongo
        cartDao = cartDaoMongo

        logger.info('Persistence: ' + persistence);
        break;
    default:  
        await conectionMongoose();
        
        userDao = userDaoMongo
        prodDao = productDaoMongo;
        //chatDao = chatDaoMongo
        cartDao = cartDaoMongo
        logger.info('Persistence Default: ' + 'MongoDB');
        break; 
};

export default { userDao, prodDao, 
    //chatDao, 
    cartDao };