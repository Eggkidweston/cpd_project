import { provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';
import { AppComponent } from './app.component';
import { HTTP_BINDINGS } from 'angular2/http';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS, HTTP_BINDINGS,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
