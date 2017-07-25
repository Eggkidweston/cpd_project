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

@Component({
    selector: 'explore',
    template: require('explore.component.html'),
    styles: [require('./explore.scss').toString()],
    directives: [AppWidgetsComponent,
                RouterOutlet,
                RouterLink,
                RatingComponent,
                PaginationComponent]
})
export class ExploreComponent implements AfterViewInit {

    private storeApps: Array<StoreApp>;
    public errorMessage: string;

    private gettingResources: boolean;
    private appsPerPage: number = 10;
    private currentPage: number = 1;
    private totalPages: number = 0;
    public resultsCount: number = 0;

    private showFilterUseType: boolean = true;
    private showFilterLevel: boolean = true;
    private showFilterSubject: boolean = false;

    private filteredUseTypes: string[];
    private filteredLevels: string[];
    private filteredSubjects: string[];

    private resourceUseTypes: Array<ResourceProperty>;
    private resourceLevels: Array<ResourceProperty>;
    private resourceSubjects: Array<ResourceProperty>;

    private subjectFilters: string[];
    private subjectDuplicateSelected: number = 0;

    private showingRecommended: boolean;

    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {

        this.filteredUseTypes = [];
        this.filteredLevels = [];
        this.filteredSubjects = [];

        this.loadResourceUseTypes();
        this.loadResourceLevels();
        this.loadResourceSubjects();

        this.subjectFilters = [];
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
        this.showingRecommended = true;
        this.appsService.getRecommendedApps(10, 1)
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.resultsCount = storeApps.availableRows;
                    this.totalPages =
                        Math.ceil(storeApps.availableRows / this.appsPerPage);
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

    toggleProperty(property: string, filter: string, array: string[], event: any) {
        event.preventDefault();

        let index = array.indexOf(property);
        if (index > -1) {
            array.splice(index, 1);

            if (filter === 'further'){
                this.subjectDuplicateSelected--;
            }
        } else {
            array.push(property);

            if (filter === 'further'){
                this.subjectDuplicateSelected++;
            }
        }

        this.currentPage = 1;
        if (this.filteredLevels.length > 0 ||
            this.filteredUseTypes.length > 0 ||
            this.filteredSubjects.length > 0) {
            this.loadResources();
        } else {
            this.loadRecommendedApps();
        }
    }

    propertySelected(subject: string, array: string[]) {
        let index: number = array.indexOf(subject);
        if (index === -1){
            return false;
        }
        return true;
    }

    getResourcePropertySyntax() {
        let resourcePropertyQuery: string = '';

        if (this.filteredUseTypes.length > 0) {
            resourcePropertyQuery += `&usetypes=${this.filteredUseTypes}`;
        }
        if (this.filteredLevels.length > 0) {
            resourcePropertyQuery += `&levels=${this.filteredLevels}`;
        }
        if (this.filteredSubjects.length > 0) {
            resourcePropertyQuery += `&subjects=${this.filteredSubjects}`;
        }

        return resourcePropertyQuery;
    }

    setSubjectFilter(value){
        let index: any = this.resourceLevels.map((o) => o.id).indexOf(parseInt(value));
        if (index === -1) {
            return;
        }

        let indexSubjectFilters: any = this.subjectFilters.indexOf(this.resourceLevels[index].filter);
        if (indexSubjectFilters > -1) {
            if (this.resourceLevels[index].filter === 'further' &&
                this.subjectDuplicateSelected > 0) {
                return;
            }

            this.subjectFilters.splice(indexSubjectFilters, 1);
            this.filteredSubjects = [];
        } else {
            this.subjectFilters.push(this.resourceLevels[index].filter);
        }
    }

    displaySubject(filter: string) {
        return this.subjectFilters.length === 0 ||
               this.subjectFilters.indexOf(filter) > -1;
    }

    loadResources() {
        this.gettingResources = true;
        this.showingRecommended = false;
        this.appsService.getResources(this.appsPerPage,
                                      this.currentPage,
                                      '',
                                      this.getResourcePropertySyntax())
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.resultsCount = storeApps.availableRows;
                    this.totalPages =
                        Math.ceil(storeApps.availableRows / this.appsPerPage);
                    this.gettingResources = false;
                },
                (error:any) => AppComponent.generalError( error.status )
            );
    }
}