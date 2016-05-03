import { appsServiceInjectables } from './apps.service';
import { authenticationServiceInjectables } from './authentication.service';
import { tagsServiceInjectables } from './tags.service';
import { signinRegisterServiceInjectables } from './signinregister.service'
import { contributorServiceInjectables } from './contributor.service';

export * from './apps.service';
export * from './authentication.service';
export * from './tags.service';
export * from './signinregister.service';
export * from './contributor.service';

export var servicesInjectables: Array<any> = [
    appsServiceInjectables, 
    authenticationServiceInjectables, 
    tagsServiceInjectables, 
    signinRegisterServiceInjectables,
    contributorServiceInjectables
];

export var appSettings = { apiRoot: 'http://store-staging.data.alpha.jisc.ac.uk:8080/' };

export var appInfo = { name: 'Application and resource store', version: 'ALPHA'}