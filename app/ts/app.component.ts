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
import { AppDetailsComponent } from './components/appdetails/appdetails.component';
import { ErrorComponent } from './components/error/error.component';
import { SignInComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthenticationService } from './services/services';


@Component({
    selector: 'appstore-app',
    directives: [ ...ROUTER_DIRECTIVES ],
    styles: [require('../sass/appstore.scss').toString()],
    template: require('./app.component.html')
})
@RouteConfig([
    { path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/appdetails/:id', name: 'AppDetails', component: AppDetailsComponent },
    { path: '/error', name: 'Error', component: ErrorComponent },
    { path: '/signin', name: 'SignIn', component: SignInComponent },
    { path: '/register', name: 'Register', component: RegisterComponent }
])
export class AppComponent {
    static router: Router;
    private currentRoute: string;
    public atSignIn: boolean = false;
    
    constructor(public authenticationService: AuthenticationService, router: Router) {
        AppComponent.router = router;
        router.subscribe((value: any) => {
            this.currentRoute = value;
            this.atSignIn = this.currentRoute === "signin";
        })
    }
    
    signOut() {
        this.authenticationService.signOut();
    }
    
    static generalError(status: any) {
        AppComponent.router.navigate(['Error', {status: status}]);
    }
}