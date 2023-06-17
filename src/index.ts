import {IServerInstances} from "./bootstrap/interfaces/IServerInstances";
import {ServerBootstrap} from "./bootstrap/server/server.bootstrap";
import {ServerFactory} from "./bootstrap/factories/server.factory";
import express from 'express';

export var app: express.Application;

/**
 * Server constant that hold server instance.
 * @type {ServerBootstrap}
 */
const server: ServerBootstrap = ServerFactory.getServerInstance();

const Index = async ()=> {
    try {
        const result: IServerInstances = await server.start();
        app = result.app;
    } catch (e) {
        console.warn("Test vars not set");
        return;
    }
}

Index().then();