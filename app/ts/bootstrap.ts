/// <reference path="../../node_modules/angular2/typings/browser.d.ts" />
/// <reference path="../../typings/main.d.ts" />

import { provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { LocationStrategy, HashLocationStrategy } from 'angular2/platform/common';

import { AppComponent } from './app.component';
import { HTTP_BINDINGS } from 'angular2/http';
import { servicesInjectables } from './services/services';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS, HTTP_BINDINGS, servicesInjectables,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
