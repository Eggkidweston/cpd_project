/**
 * Copyright 2016, Jisc.
 *
 * <license>
 * </license>
 */

import { Component } from '@angular/core'
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { WhoComponent } from './components/whocanregister/who.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { AppDetailsComponent } from './components/appdetails/appdetails.component';
import { ErrorComponent } from './components/error/error.component';
import { SignInComponent } from './components/signin/signin.component';
import { TagCloudComponent } from './components/tagcloud/tagcloud.component';
import { RegisterComponent } from './components/register/register.component';
import { AppEditComponent } from './components/appedit/appedit.component';
import { AppInfoComponent } from './components/app-info/app-info.component';
import { ContributorComponent } from 'components/store-front/contributor/contributor.component';
import { SubmitResourceComponent } from 'components/administration/submit-resource/submit-resource.component';
import { ResourceMetricsComponent } from './components/store-front/resource-metrics/resource-metrics.component';
import { AuthenticationService, SigninRegisterService, appInfo } from './services/services';
import { Apps2Service } from "./services/apps2.service";

@Component({
    selector: 'appstore-app',
    directives: [...ROUTER_DIRECTIVES],
    styles: [require('../sass/appstore.scss').toString()],
    template: require('./app.component.html'),
    providers: [
        Apps2Service
    ]
})
@RouteConfig([
    { path: '/home', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/resource/:id', name: 'AppDetails', component: AppDetailsComponent },
    { path: '/profile', name: 'Profile', component: ContributorComponent },
    { path: '/resource/edit/:id', name: 'AppEdit', component: AppEditComponent },
    { path: '/resource/info/:id', name: 'AppInfo', component: AppInfoComponent },
    { path: '/resource/metrics/:id', name: 'AppInfo', component: ResourceMetricsComponent },
    { path: '/contributor/:id', name: 'Contributor', component: ContributorComponent },
    { path: '/error', name: 'Error', component: ErrorComponent },
    { path: '/signin', name: 'SignIn', component: SignInComponent },
    { path: '/register', name: 'Register', component: RegisterComponent },
    { path: '/about', name: 'About', component: AboutComponent },
    { path: '/whocanregister', name: 'Who', component: WhoComponent },
    { path: '/tagcloud', name: 'TagCloud', component: TagCloudComponent },
    { path: '/submissions', name: 'Submissions', component: SubmitResourceComponent },
    { path: '/feedback', name: 'Feedback', component: FeedbackComponent }
])

export class AppComponent {
    static router: Router;
    private currentRoute: string;
    public appInfoname: String;
    private appVersion: String;
    private static lastRoute: string = 'Home';

    constructor(
        public authenticationService: AuthenticationService,
        public loginRegisterService: SigninRegisterService,
        router: Router) 
    {
        this.appInfoname = appInfo.name;
        this.appVersion = appInfo.version;
        AppComponent.router = router;
    }

    signOut() {
        this.authenticationService.signOut();
    }

    isRouteActive(instruction: any[]): boolean {
        return AppComponent.router.isRouteActive(AppComponent.router.generate(instruction));
    }

    // ok, I confess, this needs refactoring. This is not a good
    // approach to intercomponent communication. And it creates 
    // a necessity for a static router, which is smelly
    static generalError(status: any) {
        AppComponent.router.navigate(['Error', { status: status }]);
    }
}