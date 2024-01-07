/**
 * Application
 */
export class Application {
    /** ID */
    id: string;
    /** Identifier */
    identifier: string;
    /** Name*/
    name: string;
    /** Settings */
    setting: any;
    /** Array of module versions */
    modules: string[]
}

/**
 * New Application
 */
export class NewApplication {
    /** Name */
    name: string;
    /** Identifier */
    identifier: string;
    /** Settings */
    setting: any;
}

/**
 * New Application Module
 */
export class AddModule{
    /** Module as Base64 string */
    module: string;
    /** Module version */
    module_version: string;
}