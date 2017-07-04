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
import {StoreApp, ResourceProperty} from '../../models';
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

    private gettingResources: boolean;
    private appsPerPage:number = 10;
    private currentPage:number = 1;
    private totalPages:number = 0;
    public resultsCount:number = 0;

    private showFilterUseType: boolean = true;
    private showFilterLevel: boolean = true;
    private showFilterSubject: boolean = true;

    private resourceUseType: string;
    private resourceLevel: string;
    private resourceSubject: string[];
    private subjectFilter: string;

    private resourceUseTypes:Array<ResourceProperty>;
    private resourceLevels:Array<ResourceProperty>;
    private resourceSubjects:Array<ResourceProperty>;

    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {

        this.resourceSubject = [];

        this.loadResourceUseTypes();
        this.loadResourceLevels();
        this.loadResourceSubjects();
    }

    ngAfterViewInit() {
        this.loadRecommendedApps();
    }

    onPageClicked(page) {
        this.currentPage = page;
        this.loadResources();
    }

    loadRecommendedApps() {
        this.gettingResources = true;
        this.appsService.getRecommendedApps(10, 1)
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.gettingResources = false;
                },
                (error: any) => AppComponent.generalError(error.status)
            );
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
                this.resourceSubject = [];
                this.setSubjectFilter(property);
                break;
            case 'subject':
                let index = this.resourceSubject.indexOf(property);
                if (index > -1){
                    this.resourceSubject.splice(index);
                    break;
                }

                this.resourceSubject.push(property);
                break;
        }

        this.currentPage = 1;

        if (this.resourceLevel || this.resourceUseType || this.resourceSubject.length > 0) {
            this.loadResources();
        } else {
            this.loadRecommendedApps();
        }
    }

    setSubjectFilter(value){
        let index = this.resourceLevels.map((o) => o.id).indexOf(parseInt(value));
        if (index == -1) {
            this.subjectFilter = null;
            return;
        }
        this.subjectFilter = this.resourceLevels[index].filter;
    }

    resourceSubjectSelected(subject){
        let index = this.resourceSubject.indexOf(subject);
        if (index === -1){
            return false;
        }
        return true;
    }

    getResourcePropertySyntax() {
        let resourcePropertyQuery: string = '';

        if(this.resourceUseType) {
            resourcePropertyQuery += `&$usetype=${this.resourceUseType}`;
        }
        if(this.resourceLevel) {
            resourcePropertyQuery += `&$level=${this.resourceLevel}`;
        }
        if(this.resourceSubject.length > 0) {
            resourcePropertyQuery += `&$subject=${this.resourceSubject}`;
        }

        return resourcePropertyQuery;
    }

    loadResources() {
        this.gettingResources = true;
        this.appsService.getResources(this.appsPerPage, this.currentPage, '', this.getResourcePropertySyntax())
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