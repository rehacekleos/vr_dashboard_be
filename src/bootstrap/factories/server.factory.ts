import { ServerBootstrap } from '../server/server.bootstrap';
import { ServerType } from '../../shared/enums/serverType.enum';
import { ConfigFactory } from '../../configs/config.factory';
import { ServerBaseBootstrap } from "../server/serverBase.bootstrap";

/**
 * Server Factory <br>
 * Returns the correct instance according to the specified type
 */
export class ServerFactory {

    /**
     * Function that return server instance depending on APP_MODE env variable value.
     *
     * @returns {ServerBaseBootstrap} Server instance for express application.
     */
    public static getServerInstance(): ServerBaseBootstrap {

        const type: ServerType = ConfigFactory.getConfig().serverType;
        switch (type) {
            default:
                return new ServerBootstrap();
        }
    }
}
