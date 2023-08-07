import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { logger, stream } from '@utils/logger';
import logfile from './utils/logFile';
import path from 'path'
import fs from 'fs'
export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor() {
    this.app = express();
    this.env = 'development';
    this.port = 8081;

    this.initializeMiddlewares();
    this.initializeRoutes()
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));

    this.app.use(express.json())
  }

  private initializeRoutes() {
    this.app.post('/log/:playerName', async function (req, res, _next) {
      try {
        const playerName = req.params.playerName;
        const txtContent = req.body.content;
      
        if (!txtContent) {
          return res.status(400).json({ error: 'txtContent is required' });
        }
      
        const filePath = path.join(__dirname, `/logs/players/${playerName}.txt`);
      
        fs.writeFile(filePath, txtContent.toString(), (err) => {
          if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'An error occurred while saving the file' });
          }
          
          console.log(`File saved as: ${filePath}`);
          res.status(200).json({ message: 'File saved successfully' });
        });
      } catch(err) {
        console.log(err)
      }
    });
  }

}
