import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { SearchComponent } from '../../search/search.component';
import { RecommendedRecentComponent } from '../../recommended-recent/recommended-recent.component';
import { AppsService } from '../../../services/services';
import { StoreApp, Collection } from '../../../models';
import { AppComponent } from '../../../app.component';
import { PaginationComponent } from './pagination/pagination.component';

@Component( {
    selector: 'results',
    template: require( './results.component.html' ),
    styles: [require( './results.component.scss' ).toString()],
    directives: [AppWidgetsComponent, PaginationComponent]
} )
export class ResultsComponent
{
    private resultsApps:Array<StoreApp>;
    private resultsCollections:Array<Collection>;

    public searchTerm:string;

    private appsPerPage:number = 10;
    private collectionsPerPage:number = 3;
    private currentPage:number = 1;
    private currentPageCollections:number = 1;
    private totalPages:number = 0;
    private totalPagesCollections:number = 0;
    private activeOnly: boolean = true;

    public resultsCount:number = 0;
    public resultsCountCollections:number = 0;

    public searching:boolean = false;
    public searchingCollections:boolean = false;

    constructor( private _appsService:AppsService,
                 public router:Router,
                 params:RouteParams )
    {
        this.searching = true;
        this.searchingCollections = true;
        this.searchTerm = decodeURIComponent(params.get( 'searchterm' ));
        this.getResultsApps();
        this.getResultsCollections();
    }

    getResultsApps()
    {
        this.searching = true;
        this._appsService.getBySearchPaged(this.searchTerm, false, this.appsPerPage, this.currentPage, this.activeOnly)
                .subscribe(
                    results => {
                        this.resultsApps = results.data;
                        if(this.resultsApps.length==1) {
                            this.goSingleResult();
                        }
                        if(results.availableRows){
                          this.resultsCount = results.availableRows;
                        }
                        this.totalPages = Math.ceil(results.availableRows/this.appsPerPage);
                        this.searching = false;
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
    }

    getResultsCollections()
    {
        this.searchingCollections = true;
        this._appsService.getCollectionsBySearchPaged(this.searchTerm, false, this.collectionsPerPage, this.currentPageCollections)
                .subscribe(
                    results => {
                        this.resultsCollections = results.data;
                        this.resultsCountCollections = results.availableRows;
                        this.totalPagesCollections = Math.ceil(results.availableRows/this.collectionsPerPage);
                        this.searchingCollections = false;
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
    }

    onPageClicked(page, isCollections) {
        if(!isCollections){
            this.currentPage = page;
            this.getResultsApps();
        } else {
            this.currentPageCollections = page;
            this.getResultsCollections();
        }
    }

    goSingleResult(){
        this.router.navigate( ['AppDetails', , { id: this.resultsApps[0].id }] );
    }

    goBack()
    {
        this.router.navigate( ['Home'] );
    }

}
