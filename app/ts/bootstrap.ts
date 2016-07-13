/// <reference path="../../typings/browser.d.ts" />

import { provide } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { LocationStrategy, HashLocationStrategy } from '@angular/common/index';
import { bootstrap }from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { HTTP_BINDINGS } from '@angular/http';
import { servicesInjectables } from './services/services';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS, HTTP_BINDINGS, servicesInjectables,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
