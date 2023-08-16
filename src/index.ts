import {IServerInstances} from "./bootstrap/interfaces/IServerInstances";
import {ServerBootstrap} from "./bootstrap/server/server.bootstrap";
import {ServerFactory} from "./bootstrap/factories/server.factory";

/**
 * Server constant that hold server instance.
 * @type {ServerBootstrap}
 */
const server: ServerBootstrap = ServerFactory.getServerInstance();

const Index = async ()=> {
    try {
        const result: IServerInstances = await server.start();
    } catch (e) {
        console.warn("Test vars not set");
        return;
    }
}

Index().then();