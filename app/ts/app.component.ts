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
import { AboutComponent } from './components/about/about.component';
import { WhoComponent } from './components/whocanregister/who.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AppDetailsComponent } from './components/appdetails/appdetails.component';
import { ErrorComponent } from './components/error/error.component';
import { SignInComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { AppEditComponent } from './components/appedit/appedit.component';
import { AuthenticationService, SigninRegisterService, appInfo } from './services/services';

@Component({
    selector: 'appstore-app',
    directives: [ ...ROUTER_DIRECTIVES ],
    styles: [require('../sass/appstore.scss').toString()],
    template: require('./app.component.html')
})
@RouteConfig([
    { path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/resource/:id', name: 'AppDetails', component: AppDetailsComponent },
    { path: '/resource/edit/:id', name: 'AppEdit', component: AppEditComponent },
    { path: '/error', name: 'Error', component: ErrorComponent },
    { path: '/signin', name: 'SignIn', component: SignInComponent },
    { path: '/register', name: 'Register', component: RegisterComponent },
    { path: '/about', name: 'About', component: AboutComponent },
    { path: '/whocanregister', name: 'Who', component: WhoComponent },
    { path: '/feedback', name: 'Feedback', component: FeedbackComponent }
])

export class AppComponent {
    static router: Router;
    private currentRoute: string;
    public atSignIn: boolean = false;
    public appInfoname: String;
    private appVersion: String;
    private static lastRoute: string = 'Home';

    constructor(
        public authenticationService: AuthenticationService, 
        public loginRegisterService: SigninRegisterService,
        router: Router )
    {
        this.appInfoname = appInfo.name;
        this.appVersion = appInfo.version;
        
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