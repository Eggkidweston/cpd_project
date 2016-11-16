/**
 * Copyright 2016, Jisc.
 *
 * <license>
 * </license>
 */

import { Component } from '@angular/core'
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { HomeComponent } from './components/store-front/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { WhoComponent } from './components/whocanregister/who.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { RegisterIDPComponent } from './components/registeridp/registeridp.component';
import { AppDetailsComponent } from './components/store-front/app-details/app-details.component';
import { DownloadComponent } from './components/store-front/download/download.component';
import { AboutJorumComponent } from './components/store-front/jorum/aboutjorum.component';
import { TermsComponent } from './components/store-front/terms/terms.component';
import { ComingSoonComponent } from './components/store-front/comingsoon/comingsoon.component';
import { SupportComponent } from './components/store-front/support/support.component';
import { TryComponent } from './components/store-front/try/try.component';
import { ErrorComponent } from './components/error/error.component';
import { SignInComponent } from './components/signin/signin.component';
import { ResultsComponent } from './components/store-front/results/results.component';
//import { TagCloudComponent } from './components/tagcloud/tagcloud.component';
import { ExploreComponent } from './components/explore/explore.component';
import { RegisterComponent } from './components/register/register.component';
//import { AppEditComponent } from './components/appedit/appedit.component';
import { AppInfoComponent } from './components/app-info/app-info.component';
import { ContributorComponent } from './components/store-front/contributor/contributor.component';
import { SubmitResourceComponent } from './components/administration/submit-resource/submit-resource.component';
import { ResourceMetricsComponent } from './components/store-front/resource-metrics/resource-metrics.component';
import { AuthenticationService, appInfo } from './services/services';
import { SigninRegisterService } from "./services/services";
import { RevisionHistoryComponent } from './components/version-control/revision-history/revision-history.component';
import myGlobals = require('./globals'); 

@Component( {
    selector: 'appstore-app',
    directives: [...ROUTER_DIRECTIVES],
    styles: [require( '../sass/appstore.scss' ).toString()],
    template: require( './app.component.html' )
} )
@RouteConfig( [
    { path: '/home', name: 'Home', component: HomeComponent, useAsDefault:true },
    { path: '/resource/:id', name: 'AppDetails', component: AppDetailsComponent },
    { path: '/profile', name: 'Profile', component: ContributorComponent },
    { path: '/download/:id', name: 'Download', component: DownloadComponent },
    { path: '/try/:id', name: 'Try', component: TryComponent },
    { path: '/resource/info/:id', name: 'AppInfo', component: AppInfoComponent },
    { path: '/resource/revision/:id', name: 'AppInfo', component: RevisionHistoryComponent },
    { path: '/resource/metrics/:id', name: 'AppInfo', component: ResourceMetricsComponent },
    { path: '/contributor/:id', name: 'Contributor', component: ContributorComponent },
    { path: '/aboutjorum', name: 'AboutJorum', component: AboutJorumComponent },
    { path: '/error', name: 'Error', component: ErrorComponent },
    { path: '/signin', name: 'SignIn', component: SignInComponent },
    { path: '/register', name: 'Register', component: RegisterComponent },
    { path: '/registeridp', name: 'RegisterIDP', component: RegisterIDPComponent },
    { path: '/about', name: 'About', component: AboutComponent },
    { path: '/whocanregister', name: 'Who', component: WhoComponent },
    { path: '/explore', name: 'Explore', component: ExploreComponent },
    { path: '/terms', name: 'Terms', component: TermsComponent },
    { path: '/comingsoon', name: 'ComingSoon', component: ComingSoonComponent },
    { path: '/support', name: 'Support', component: SupportComponent },
    { path: '/results/:searchterm', name: 'Results', component: ResultsComponent },
    { path: '/feedback', name: 'Feedback', component: FeedbackComponent }
    //{ path: '/submissions', name: 'Submissions', component: SubmitResourceComponent },
] )

export class AppComponent
{
    static router:Router;
    public appInfoname:String;
    public appInfoStrap:String;
    private appVersion:String;
    public narrowHeader:Boolean;
    public showCookiebar:boolean;
    private idpJWT;


    constructor( public authenticationService:AuthenticationService,
                 protected signinRegisterService:SigninRegisterService,
                 public router:Router )
    {
        this.checkCookieBar();
        
        
        this.appInfoname = appInfo.name;
        this.appInfoStrap = appInfo.strap;
        this.appVersion = appInfo.version;
        AppComponent.router = router;
        
        this.narrowHeader = myGlobals.narrowHeader;
        
        router.subscribe((value: any) => {
            if( value.indexOf('try/')==0 ) {
                this.narrowHeader = true;
            }else{
                this.narrowHeader = false;
            }
        });

        if(window.location.href.indexOf('token')>-1&&window.location.href.indexOf('jwt')>-1){
            this.idpJWT = JSON.parse(this.getParameterByName('token', window.location.href));
            var jwtArr = this.idpJWT.jwt.split('.');
            var payload = JSON.parse(this.base64Decode(jwtArr[1]));
            if (typeof(Storage) !== "undefined") {
                let pidarr = payload.data.pid.split('!');
                var pidmail = pidarr[pidarr.length-1] + '@jiscpidmail.co.uk';
                localStorage.setItem("pid", pidmail);
            }
            AppComponent.router.navigate( ['RegisterIDP'] );
        }
    }

    checkCookieBar() {
        if (typeof(Storage) !== "undefined") {
            let cookieBarLS = localStorage.getItem("cookiebarshown");
            if(cookieBarLS=="yes"){
                this.showCookiebar = false;
            }else{
                this.showCookiebar =true;
            }
        }
    }

    clickCookieBar(){
        localStorage.setItem('cookiebarshown', 'yes');
        this.checkCookieBar();
    }

    base64Decode(s) {
        var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
        var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for(i=0;i<64;i++){e[A.charAt(i)]=i;}
        for(x=0;x<L;x++){
            c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
            while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
        }
        return r;
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    signOut()
    {
        AuthenticationService.signOut();
        AppComponent.router.navigate( ['Home'] );
    }

    isRouteActive( instruction:any[] ):boolean
    {
        return AppComponent.router.isRouteActive( AppComponent.router.generate( instruction ) );
    }


    
    // ok, I confess, this needs refactoring. This is not a good
    // approach to intercomponent communication. And it creates
    // a necessity for a static router, which is smelly
    static generalError( status:any )
    {
        if( status == 401 ) {
            AuthenticationService.signOut();
            AppComponent.router.navigate( ['SignIn'] );
        } else {
            AppComponent.router.navigate( ['Error', { status: status }] );
        }
    }
}