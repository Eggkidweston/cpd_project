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
import { HomeComponent } from './components/home/home.component';
// import { ErrorComponent } from './components/error/error.component';
import { AppDetailsComponent } from './components/appdetails/appdetails.component';
import { SignInComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';

@Component({
    selector: 'appstore-app',
    directives: [ ...ROUTER_DIRECTIVES ],
    styles: [require('../sass/appstore.scss').toString()],
    template: require('./app.component.html')
})
@RouteConfig([
    { path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/appdetails/:id', name: 'AppDetails', component: AppDetailsComponent },
    // { path: '/error', name: 'Error', component: ErrorComponent },
    { path: '/signin', name: 'SignIn', component: SignInComponent },
    { path: '/register', name: 'Register', component: RegisterComponent }
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