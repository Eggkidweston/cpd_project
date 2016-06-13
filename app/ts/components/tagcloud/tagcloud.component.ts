import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RatingComponent } from '../shared/rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { Apps2Service } from '../../services/apps2.service.ts';
import {StoreApp, TagCloud} from '../../models';
import { AppComponent } from '../../app.component';


import { AppWidgetsComponent } from '../appwidgets/appwidgets.component';


require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'tagcloud',
    template: require('tagcloud.component.html'),
    styles: [require('../../../sass/tagcloud.scss').toString()],

    directives: [ AppWidgetsComponent,RouterOutlet, RouterLink, RatingComponent]
})
export class TagCloudComponent implements AfterViewInit {

    public resourceId: number;

    private storeApps: Array<StoreApp>;
    public errorMessage:string;

    public tagcloud: TagCloud;
    public chosenTag: string;


    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService, public apps2Service: Apps2Service,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
        this.resourceId = +params.get('id');
        this.chosenTag = params.get('tag');
    }

    ngAfterViewInit() {
        this.loadCloud();
    }

    getTaggedApps(tag){
        this.chosenTag = tag;
        this.appsService.getByTag(tag)
            .subscribe(
                storeApps => {this.storeApps = storeApps;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    getSomeApps(){
        this.appsService.getResources(100,1)
            .subscribe(
                storeApps => {this.storeApps = storeApps;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadCloud() {
        this.appsService.getTagCloud()
            .subscribe(
                tagcloud => {
                    this.tagcloud = tagcloud;
                    if(this.chosenTag) {
                        this.getTaggedApps(this.chosenTag);
                    }else{
                        this.getSomeApps();
                    }
                },
                (error: any) => AppComponent.generalError(error.status)
            );

        error =>  this.errorMessage = <any>error;

    }

}