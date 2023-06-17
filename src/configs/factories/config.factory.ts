import { AppModeEnum } from '../../shared/enums/appMode.enum';
import { baseConfig } from '../base.config';
import { productionConfig } from '../production.config';
import { localhostConfig } from '../localhost.config';

export class ConfigFactory {
    public static getConfig(){
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