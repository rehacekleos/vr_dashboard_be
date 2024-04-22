import { ConfigModel } from './config.model';

/**
 * Production configuration
 */
export const productionConfig: ConfigModel = {
    swaggerApiTarget: process.env.CUSTOM_SWAGGER_API_TARGET,
}