import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RatingComponent } from '../shared/rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
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
    styles: [require('../appdetails/app-details.scss').toString()],

    directives: [ RouterOutlet, RouterLink, RatingComponent]
})
export class DownloadSourceComponent implements AfterViewInit {
    public app: StoreApp;
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

        

    }


}