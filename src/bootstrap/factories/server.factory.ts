import { ServerBootstrap } from '../server/server.bootstrap';
import { ServerType } from '../../shared/enums/serverType.enum';
import { ConfigFactory } from '../../configs/config.factory';

export class ServerFactory {

    /**
     * Function that return server instance depending on NODE_ENV variable value.
     *
     * @returns {ServerBootstrap} Server instance for express application.
     */
    public static getServerInstance() {

        const type: ServerType = ConfigFactory.getConfig().serverType;
        switch (type) {
            default:
                return new ServerBootstrap();
        }
    }
}
