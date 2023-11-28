import { dirname } from 'path';
import { fileURLToPath } from "url";
import MongoStore from 'connect-mongo';
import { connectionString } from './persistance/daos/mongodb/conection.js';

export const __dirname = dirname(fileURLToPath(import.meta.url));



import {hashSync, compareSync, genSaltSync } from 'bcrypt';


/**
 * haseha la password
 * @param {*} password string
 * @returns password hasheada
 */
export const createHash = (password) => hashSync(password, genSaltSync(10))


/**
 * compara la password hasheada con la password en user
 * @param {*} user 
 * @param {*} password string
 * @returns boolean
 */
export const isValidPassword = (password, user) => compareSync(password, user.password);


export const mongoStoreOptions = {
    store: MongoStore.create({
        mongoUrl: connectionString,
        crypto: {
            secret: '1234'
        }
    }),
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
};

/**
 * respuesta estandar
 * @param {*} res 
 * @param {*} statusCode number
 * @param {*} data string
 */
export const createResponse = (res, statusCode, data) => {
    return res.status(statusCode).json({ data });
  };
