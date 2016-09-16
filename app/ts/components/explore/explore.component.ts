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

    private storeApps: Array<StoreApp>;
    public errorMessage: string;

    public tagcloud: TagCloud;
    public selectedTags: TagCloud;
    public chosenOrder: string;
    private queryTags: string;
    private tagArray: number[];
    private gettingTags: boolean;


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
            //console.log('loadCloud ngAfterViewInitA');
            this.loadCloud(this.queryTags);
        }
        else {
            //console.log('loadCloud ngAfterViewInitB');
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
       // console.log('loadCloud selectTag');
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
        this.appsService.getResources(100, 1, this.selectedTags.GetFilterSyntax())
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    //console.log(this.storeApps);
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

    loadCloud(initialSelectedId = null) {
        //console.log(initialSelectedId);
        //console.log(this.selectedTags);
        this.gettingTags = true;
        if (this.selectedTags.Tags.length > 0) {
            //console.log('use selectedTags');
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