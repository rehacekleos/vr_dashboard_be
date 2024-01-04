import { AppModeEnum } from '../shared/enums/appMode.enum';
import { baseConfig } from './base.config';
import { productionConfig } from './production.config';
import { localhostConfig } from './localhost.config';
import { BaseConfigModel, ConfigModel } from "./config.model";

/**
 * Configuration factory
 */
export class ConfigFactory {

    /**
     * Getting actual application configuration by application mode
     */
    public static getConfig(): BaseConfigModel & ConfigModel{
        const type: AppModeEnum = AppModeEnum[process.env.APP_MODE];
        const baseConf = baseConfig;

        switch (type) {
            case AppModeEnum.PRODUCTION:
                return {...baseConf, ...productionConfig}
            default:
                return {...baseConf, ...localhostConfig}
        }
    }
}