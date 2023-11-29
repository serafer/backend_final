import { createLogger, format, transports, addColors } from 'winston';
import winston from 'winston';
const { combine, printf, timestamp, colorize } = format;
import { fileURLToPath } from "url";
const { __dirname } = require("path");


const customLogger = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {

        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"

    }
};

winston.addColors(customLogger.colors);

const enviroment = process.argv[2];
let logConfig; 

if (enviroment === "dev") {
    logConfig = {
        levels: customLogger.levels,
        level: 'debug',
        format: combine(
            timestamp({
                format: 'MM-DD-YYYY HH:mm:ss',
            }),
            colorize(addColors(customLogger.colors)),
            printf((info) => `${info.level} | ${info.timestamp} | ${info.message}`)
        ),
        transports: [new transports.Console()]
    };
} else {
    logConfig = {
        levels: customLogger.levels,
        level: 'info',
        format: combine(
            timestamp({
                format: 'MM-DD-YYYY HH:mm:ss',
            }),
            printf((info) => `${info.level} | ${info.timestamp} | ${info.message}`)
        ),
        transports: [new transports.File({
            filename: `${__dirname}/../logs/errors.log`
        })],


    };
}

export const logger = createLogger(logConfig);
