import { appsServiceInjectables } from './apps.service';
import { authenticationServiceInjectables } from './authentication.service';
import { tagsServiceInjectables } from './tags.service';
import { signinRegisterServiceInjectables } from './signinregister.service'
import { contributorServiceInjectables } from './contributor.service';
import { versionControlServiceInjectables } from './version-control.service';

export * from './apps.service';
export * from './authentication.service';
export * from './tags.service';
export * from './signinregister.service';
export * from './contributor.service';
export * from './version-control.service';

export var servicesInjectables: Array<any> = [
    appsServiceInjectables,
    authenticationServiceInjectables, 
    tagsServiceInjectables, 
    signinRegisterServiceInjectables,
    contributorServiceInjectables,
    versionControlServiceInjectables
];

export var appSettings = {
    apiRoot: 'http://store.data.alpha.jisc.ac.uk:8080/',
    curationRoot: 'http://curation-staging.data.alpha.jisc.ac.uk/',
    s3Root: 'https://s3-eu-west-1.amazonaws.com/jisc-store-resources/'
};

export var appInfo = { name: 'Application and resource store', version: 'ALPHA'}