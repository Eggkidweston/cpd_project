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
import { PaginationComponent } from './pagination/pagination.component';


import {AppWidgetsComponent} from '../appwidgets/appwidgets.component';


require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'explore',
    template: require('explore.component.html'),
    styles: [require('../../../sass/explore.scss').toString()],

    directives: [AppWidgetsComponent, RouterOutlet, RouterLink, RatingComponent,PaginationComponent]
})
export class ExploreComponent implements AfterViewInit {

    private storeApps: Array<StoreApp>;
    public errorMessage: string;

    public tagcloud: TagCloud;
    public selectedTags: TagCloud;
    public chosenOrder: string;
    private queryTags: string;
    private gettingTags: boolean;
    private gettingResources: boolean;
    private appsPerPage:number = 100;
    private currentPage:number = 1;
    private totalPages:number = 0;
    public resultsCount:number = 0;

    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
        
        this.queryTags = params.get('tags');
        this.chosenOrder = "pop";

        this.selectedTags = new TagCloud([]);
    }


    ngAfterViewInit() {
        if (this.queryTags) {
            this.loadCloud(this.queryTags);
        }
        else {
            this.loadCloud();
        }
    }

    getTaggedApps(tag) {
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
        this.selectedTags = this.selectedTags || new TagCloud([]);
        this.selectedTags.AddTag(selectedTag);
        this.loadCloud();
    }

    selectTagFromDB(tagId) {
        this.appsService.getTags(tagId)
            .subscribe(
                tags => {
                        this.gettingTags = false;
                        this.selectedTags = new TagCloud([tags[0]]);
                        this.loadCloud();
                        this.loadApps();

                    },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    removeTag(tagId) {
        this.selectedTags.RemoveTag(tagId);
        this.loadCloud();
    }

    order(order) {
        this.chosenOrder = order;
        this.selectedTags = new TagCloud([]);
        
        this.loadCloud();
    }

    loadApps() {
        console.log('loading apps');
        this.gettingResources = true;
        this.appsService.getResources(this.appsPerPage, this.currentPage, this.selectedTags.GetFilterSyntax())
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.resultsCount = storeApps.availableRows;
                    this.totalPages = Math.ceil(storeApps.availableRows/this.appsPerPage);
                    this.gettingResources = false;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    onPageClicked(page) {
        this.currentPage = page;
        this.loadApps();
    }

    loadRecomendedApps() {
        this.gettingResources = true;
        this.appsService.getRecommendedApps(100, 1)
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.gettingResources = false;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadCloud(initialSelectedId = null) {
        this.gettingTags = true;
        this.gettingResources = true;
        if (this.selectedTags.Tags.length > 0) {
            var tagIds = this.selectedTags.GetIds();
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
            if (initialSelectedId != null){
                //console.log('use initialSelectedId');
                this.selectTagFromDB(initialSelectedId);
            } else {
            this.appsService.getTagCloud(true, 50, this.chosenOrder)
                .subscribe(
                    tags => {
                        //console.log('getTagCloud');
                        //console.log(tags);
                        this.gettingTags = false;
                        this.tagcloud = new TagCloud(tags);
                        this.loadRecomendedApps();
                        
                    },
                    (error: any) => AppComponent.generalError(error.status)
                );

            }
        }
        error => this.errorMessage = <any>error;

    }


}