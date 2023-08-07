import winston, { createLogger, format, transports} from "winston"
import fs from "fs"
import path from "path"

const logDir: string = path.join(__dirname, '../logs');

function logfile(nameOfPlayer: string) {
    const logsys = createLogger({
        level: "info",
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                dirname: logDir + '/players',
                filename: `${nameOfPlayer}.log`,
                level: 'info'
            })
        ]
    })

    return logsys
}

export default logfile