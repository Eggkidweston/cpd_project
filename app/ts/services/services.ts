import { appsServiceInjectables } from './apps.service';
import { authenticationServiceInjectables } from './authentication.service';

export * from './apps.service';
export * from './authentication.service';

export var servicesInjectables: Array<any> = [
    appsServiceInjectables, authenticationServiceInjectables
];

export var appSettings = { apiRoot: 'http://store.data.alpha.jisc.ac.uk:8080/'};