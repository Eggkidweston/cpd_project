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
import {StoreApp, TagCloud, Tag} from '../../models';
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
    public selectedTags: TagCloud;
    public chosenTag: string;
    public chosenOrder: string;
   // private chosenTags: string;
    private tagArray: number[];
    private gettingTags: boolean;


    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
        this.resourceId = +params.get('id');
        this.chosenTag = params.get('tag');
      //  this.chosenTags = params.get('tags');
        this.chosenOrder = "pop";

        this.selectedTags = new TagCloud([]);
    }



    ngAfterViewInit() {

        this.loadCloud();
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
        var selectedTag = this.tagcloud.GetTag(tagId);
        this.selectedTags = this.selectedTags ||  new TagCloud([]);
        this.selectedTags.AddTag(selectedTag);
        this.loadCloud();

    }

    removeTag(tagId) {
        this.selectedTags.RemoveTag(tagId);
        this.loadCloud();
    }

    order(order){
        this.chosenOrder = order;
        this.selectedTags =  new TagCloud([]);
        this.loadCloud();
    }

    loadApps() {
        this.appsService.getResources(100, 1, this.selectedTags.GetFilterSyntax())
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadRecomendedApps() {
        this.appsService.getRecommendedApps(100, 1)
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadCloud() {
        this.gettingTags = true;
        if (this.selectedTags.Tags.length > 0) {
            var tagIds  = this.selectedTags.GetIds();
            this.appsService.getRelatedTags(tagIds)
                .subscribe(
                    tags => {
                        this.gettingTags = false;
                        this.tagcloud = new TagCloud(tags);
                          this.loadApps();
                    },
                    (error: any) => AppComponent.generalError(error.status)
                );
        }
        else {
            this.appsService.getTagCloud(true, 50, this.chosenOrder)
                .subscribe(
                    tags => {
                        this.gettingTags = false;
                        this.tagcloud = new TagCloud(tags);
                        this.loadRecomendedApps();
                    },
                    (error: any) => AppComponent.generalError(error.status)
                );
        }
        error => this.errorMessage = <any>error;

    }



}