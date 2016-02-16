 import { appsServiceInjectables } from './apps.service';

export * from './apps.service';

export var servicesInjectables: Array<any> = [
    appsServiceInjectables
];

export var appSettings = { apiRoot: 'api/'};