import { Component, Input, AfterViewInit, ChangeDetectorRef } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { Apps2Service } from '../../services/apps2.service.ts';
import { StoreApp } from '../../models';
import { ShadowApp } from '../../models';
import { AppComponent } from '../../app.component';




require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'app-details',
    template: require('./download.component.html'),
    styles: [require('../../../sass/appdetails.scss').toString()],

    directives: [ RouterOutlet, RouterLink, RatingComponent]
})
export class DownloadSourceComponent implements AfterViewInit {
    public app: StoreApp;
    public shadowApps: ShadowApp[] = [];
    public shadowApp: ShadowApp;
    public resourceId: number;


    public errorMessage:string;


    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService, public apps2Service: Apps2Service,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
        this.resourceId = +params.get('id');
    }

    ngAfterViewInit() {
        this.loadApp();

    }

    loadApp() {
        this.appsService.getAppDetails(this.resourceId)
            .subscribe(
                storeApp => {
                    this.app = storeApp;

                },
                (error: any) => AppComponent.generalError(error.status)
            );

        this.apps2Service.getApp(this.resourceId)
            .subscribe(
                shadowApps => {
                    this.shadowApps = shadowApps,
                        this.getShadow()
                }
        error =>  this.errorMessage = <any>error
    );

    }

    getShadow()
    {

        this.shadowApp=this.shadowApps[0];
        console.log(this.shadowApps);

    }

    goCuration(){

        var url = 'http://localhost:3000/#/curation/'+this.app.id


        window.location.href=url;

    }


}