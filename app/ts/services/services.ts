import { appsServiceInjectables } from './apps.service';
import { authenticationServiceInjectables } from './authentication.service';
import { tagsServiceInjectables } from './tags.service';
import { signinRegisterServiceInjectables } from './signinregister.service'
import { contributorServiceInjectables } from './contributor.service';
import { versionControlServiceInjectables } from './version-control.service';
import { idpRegisterServiceInjectables } from './idpregister.service';

export * from './apps.service';
export * from './authentication.service';
export * from './tags.service';
export * from './signinregister.service';
export * from './contributor.service';
export * from './version-control.service';
export * from './idpregister.service';
export var servicesInjectables: Array<any> = [
    appsServiceInjectables,
    authenticationServiceInjectables, 
    tagsServiceInjectables, 
    signinRegisterServiceInjectables,
    contributorServiceInjectables,
    versionControlServiceInjectables,
    idpRegisterServiceInjectables
];

export var appInfo = { name: 'Store', strap: 'Open and commercial educational apps and resources', version: 'JORUM PREVIEW RELEASE'}