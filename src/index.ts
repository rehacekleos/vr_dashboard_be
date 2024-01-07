import { IServerInstances } from "./bootstrap/interfaces/IServerInstances";
import { ServerBootstrap } from "./bootstrap/server/server.bootstrap";
import { ServerFactory } from "./bootstrap/factories/server.factory";
import { ServerBaseBootstrap } from "./bootstrap/server/serverBase.bootstrap";

/**
 * Server constant that hold server instance.
 * @type {ServerBaseBootstrap}
 */
const server: ServerBaseBootstrap = ServerFactory.getServerInstance();

const Index = async ()=> {
    try {
        const result: IServerInstances = await server.start();
    } catch (e) {
        console.warn("Test vars not set");
        return;
    }
}

Index().then();