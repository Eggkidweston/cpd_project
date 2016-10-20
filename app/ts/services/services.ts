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

export var appSettings = {
    apiRoot: 'https://store-staging.data.alpha.jisc.ac.uk:8080/',
    curationRoot: 'https://curation-staging.data.alpha.jisc.ac.uk/',
    s3Root: 'https://s3-eu-west-1.amazonaws.com/jisc-store-resources/',
    idpMembers: 'https://microservice.data.alpha.jisc.ac.uk:1337/idps'
};

export var appInfo = { name: 'App and resource store', version: 'JORUM PREVIEW RELEASE'}