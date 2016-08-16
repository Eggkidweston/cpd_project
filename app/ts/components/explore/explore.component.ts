import {Component, Input, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {RatingComponent} from '../shared/rating/rating.component';
import {
    RouterOutlet,
    RouterLink,
    RouteConfig,
    RouteParams,
    Router,
    ROUTER_DIRECTIVES
} from '@angular/router-deprecated';
import {AuthenticationService} from '../../services/services';
import {AppsService} from '../../services/services';
import {StoreApp, TagCloud} from '../../models';
import {AppComponent} from '../../app.component';


import {AppWidgetsComponent} from '../appwidgets/appwidgets.component';


require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'explore',
    template: require('explore.component.html'),
    styles: [require('../../../sass/explore.scss').toString()],

    directives: [AppWidgetsComponent, RouterOutlet, RouterLink, RatingComponent]
})
export class ExploreComponent implements AfterViewInit {

    public resourceId: number;

    private storeApps: Array<StoreApp>;
    public errorMessage: string;

    public tagcloud: TagCloud;
    public selectedTagcloud: TagCloud;
    public chosenTag: string;
    private chosenTags: string;
    private tagArray: number[];


    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
        this.resourceId = +params.get('id');
        this.chosenTag = params.get('tag');
        this.chosenTags = params.get('tags');
    }

    private getIntArrayFromChosen() {
        this.tagArray = this.chosenTags == null ? [] : this.chosenTags.split(",").filter(Boolean).map(Number);
    }

    private processChosenTags() {
        this.getIntArrayFromChosen();
        if (this.tagArray.length == 0) {
            this.selectedTagcloud = undefined;
            this.loadCloud();
        } else {
            this.loadTags();
        }
    }

    ngAfterViewInit() {
        this.processChosenTags();
    }


    getTaggedApps(tag) {
        this.chosenTag = tag;
        this.appsService.getByTag(tag)
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    selectTag(tagId) {
        this.chosenTags = this.chosenTags == null ? tagId + "," : this.chosenTags += tagId + ",";
        this.processChosenTags()

    }

    removeTag(tagId) {
        this.tagArray.splice(this.tagArray.indexOf(tagId), 1);
        this.chosenTags = this.tagArray.join();
        this.processChosenTags();
    }

    getSomeApps() {
        this.appsService.getResources(100, 1)
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadCloud() {
        if (this.tagArray.length > 0) {
            this.appsService.getRelatedTags(this.tagArray)
                .subscribe(
                    tagcloud => {
                        this.tagcloud = tagcloud;
                        //  this.getSomeApps();
                    },
                    (error: any) => AppComponent.generalError(error.status)
                );
        }
        else {
            this.appsService.getTagCloud(true)
                .subscribe(
                    tagcloud => {
                        this.tagcloud = tagcloud;
                        this.getSomeApps();
                    },
                    (error: any) => AppComponent.generalError(error.status)
                );
        }
        error => this.errorMessage = <any>error;

    }

    loadTags() {
        this.appsService.getTags(this.tagArray)
            .subscribe(
                tags => {
                    this.selectedTagcloud = tags;
                    this.loadCloud();
                    this.getSomeApps();

                },
                (error: any) => AppComponent.generalError(error.status)
            );

        error => this.errorMessage = <any>error;

    }

}