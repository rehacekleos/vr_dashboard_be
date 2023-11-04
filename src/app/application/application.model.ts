export class Application {
    id: string;
    identifier: string;
    name: string;
    setting: any;
    modules: string[]
}

export class NewApplication {
    name: string;
    identifier: string;
    setting: any;
}

export class AddModule{
    module: string;
    log_version: string;
}