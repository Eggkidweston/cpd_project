import { appsServiceInjectables } from './apps.service';
import { authenticationServiceInjectables } from './authentication.service';
import { tagsServiceInjectables } from './tags.service';

export * from './apps.service';
export * from './authentication.service';
export * from './tags.service';

export var servicesInjectables: Array<any> = [
    appsServiceInjectables, authenticationServiceInjectables, tagsServiceInjectables
];

export var appSettings = { apiRoot: 'http://store-staging.data.alpha.jisc.ac.uk:8080/' };

export var appInfo = { name: 'Application and resource store', version: 'ALPHA'}