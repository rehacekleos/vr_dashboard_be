import { ServerBaseBootstrap } from './serverBase.bootstrap';
import express from 'express';
import cluster from "cluster";
import { IServerInstances } from "../interfaces/IServerInstances";

/**
 * Server bootstrap <br>
 * Setting number of application instances <br>
 * Use Node.js cluster package
 * @extends {ServerBaseBootstrap}
 */
export class ServerBootstrap extends ServerBaseBootstrap{

    constructor() {
        super();
    }

    public async start(): Promise<IServerInstances> {

        let app: express.Application;

        if (this.workers === 1) {
            console.info(`Setting up 1 worker.`)
            app = this.initServer();
        } else if (cluster.isMaster) {
            console.info(`Master cluster setting up ${this.workers} workers.`);
            for (let i = 0; i < this.workers; i++) {
                cluster.fork();
            }
            cluster.on('online', function (worker) {
                console.info(`Worker ${worker.process.pid} is online`);
            });

            cluster.on('exit', function (worker, code, signal) {
                console.info(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
                console.info('Starting a new worker');
                cluster.fork();
            });
        } else {
            app = this.initServer();
        }

        return {
            app: app
        }
    }
}
