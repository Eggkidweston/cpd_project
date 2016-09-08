import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { SearchComponent } from '../../search/search.component';
import { RecommendedRecentComponent } from '../../recommended-recent/recommended-recent.component';
import { AppsService } from '../../../services/services';
import { StoreApp } from '../../../models';
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
    public searchTerm:string;
    
    private appsPerPage:number = 10;
    private currentPage:number = 1;
    private totalPages:number = 0;

    public resultsCount:number = 0;

    public searching:boolean = false;

    constructor( private _appsService:AppsService,
                 public router:Router,
                 params:RouteParams )
    {
        this.searching = true;
        this.searchTerm = decodeURIComponent(params.get( 'searchterm' ));
        this.getResultsApps();
    }

    getResultsApps()
    {
        this.searching = true;
        this._appsService.getBySearchPaged(this.searchTerm, false, this.appsPerPage, this.currentPage)
                .subscribe(
                    results => {
                        this.resultsApps = results.data;
                        this.resultsCount = results.availableRows;
                        //this.totalPages = Math.ceil(results.availableRows/this.appsPerPage);
                        this.searching = false;
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
    }

    onPageClicked(page) {
        this.currentPage = page;
        this.getResultsApps();
    }

    goBack()
    {
        this.router.navigate( ['Home'] );
    }

}   