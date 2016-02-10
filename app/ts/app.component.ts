/**
 * Copyright 2016, Jisc.
 *
 * <license>
 * </license>
 */

/// <reference path="../../typings/tsd.d.ts" />
import { Directive, Component, ElementRef, Renderer } from 'angular2/core'
import { RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Http, Headers } from 'angular2/http';
import { HomeComponent } from './components/home.component';

@Component({
    selector: 'appstore-app',
    directives: [ ...ROUTER_DIRECTIVES ],
    styles: [require('../sass/appstore.scss').toString()],
    template: require('./app.component.html')
})
@RouteConfig([
    { path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true }
//    { path: '/error', name: 'Error', component: ErrorComponent },
//    { path: '/signup', name: 'Signup', component: SignupComponent, useAsDefault: true },
//    { path: '/signin', name: 'Signin', component: SigninComponent },
])
export class AppComponent {
    static router: Router;
    
    constructor(router: Router) {
        AppComponent.router = router;
    }
    
    static generalError(status: any) {
        AppComponent.router.navigate(['Error', {status: status}]);
    }
}

/*
 * Components
 */
// import { SuchAndSuch } from './components/SuchAndSuch';

/*
 * Injectables
 */
// import { servicesInjectables } from './services/services';
// import { utilInjectables } from './util/util';

/*
 * Services
 */
// import { SuchAndSuchService } from './services/services';

/*
 * Webpack
 */
// require('../css/styles.scss');

// bootstrap(AppStoreApp, [ servicesInjectables, utilInjectables ]);
