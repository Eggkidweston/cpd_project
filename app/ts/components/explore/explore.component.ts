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
import {StoreApp, TagCloud, Tag, ResourceProperty} from '../../models';
import {AppComponent} from '../../app.component';
import { PaginationComponent } from './pagination/pagination.component';
import {AppWidgetsComponent} from '../appwidgets/appwidgets.component';


require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'explore',
    template: require('explore.component.html'),
    styles: [require('./explore.scss').toString()],
    directives: [AppWidgetsComponent, RouterOutlet, RouterLink, RatingComponent,PaginationComponent],
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
    private appsPerPage:number = 10;
    private currentPage:number = 1;
    private totalPages:number = 0;
    public resultsCount:number = 0;

    private showFilterTag: boolean = false;
    private showFilterUseType: boolean = true;
    private showFilterLevel: boolean = true;
    private showFilterSubject: boolean = true;

    private resourceUseType: string;
    private resourceLevel: string;
    private resourceSubject: string;
    private subjectFilter: string;

    private resourceUseTypes:Array<ResourceProperty>;
    private resourceLevels:Array<ResourceProperty>;
    private resourceSubjects:Array<ResourceProperty>;

    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
        
        this.queryTags = params.get('tags');
        this.chosenOrder = "pop";

        this.selectedTags = new TagCloud([]);

        this.loadResourceUseTypes();
        this.loadResourceLevels();
        this.loadResourceSubjects();
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

    selectTag(event, tagId) {
        event.preventDefault();
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
                this.totalPages = 0;
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

    loadResourceUseTypes() {
        this.appsService.getResourceUseTypes()
            .subscribe(
                resourceUseTypes =>
                {
                    this.resourceUseTypes = resourceUseTypes;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadResourceLevels() {
        this.appsService.getResourceLevels()
            .subscribe(
                resourceLevels =>
                {
                    this.resourceLevels = resourceLevels;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadResourceSubjects() {
        this.appsService.getResourceSubjects()
            .subscribe(
                resourceSubjects =>
                {
                    this.resourceSubjects = resourceSubjects;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    selectResourceProperty(propertyType, property, event) {
        event.preventDefault();

        switch(propertyType) {
            case 'useType':
                if (this.resourceUseType === property) {
                    this.resourceUseType = null;
                    break;
                }
                this.resourceUseType = property;
                break;
            case 'level':
                if (this.resourceLevel === property) {
                    this.resourceLevel = null;
                    this.subjectFilter = null;
                    break;
                }
                this.resourceLevel = property;
                this.resourceSubject = null;
                this.setSubjectFilter(property);
                break;
            case 'subject':
                if (this.resourceSubject === property) {
                    this.resourceSubject = null;
                    break;
                }
                this.resourceSubject = property;
                break;
        }

        this.currentPage = 1;
        this.refreshApps();
    }

    setSubjectFilter(value){
        let index = this.resourceLevels.map((o) => o.id).indexOf(parseInt(value));
        if (index == -1) {
            this.subjectFilter = null;
            return;
        }
        this.subjectFilter = this.resourceLevels[index].filter;
    }

    getResourcePropertySyntax() {
        let resourcePropertyQuery: string = '';

        if(this.resourceUseType) {
            resourcePropertyQuery += `&$usetype=${this.resourceUseType}`;
        }
        if(this.resourceLevel) {
            resourcePropertyQuery += `&$level=${this.resourceLevel}`;
        }
        if(this.resourceSubject) {
            resourcePropertyQuery += `&$subject=${this.resourceSubject}`;
        }

        return resourcePropertyQuery;
    }

    refreshApps(){
        this.gettingResources = true;
        this.appsService.getResources(this.appsPerPage, this.currentPage, this.selectedTags.GetFilterSyntax(), this.getResourcePropertySyntax())
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.resultsCount = storeApps.availableRows;
                    this.totalPages = Math.ceil(storeApps.availableRows/this.appsPerPage);
                    this.gettingResources = false;
                },
                (error:any) => AppComponent.generalError( error.status )
            );
    }
}