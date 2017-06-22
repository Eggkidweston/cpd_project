import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { SearchComponent } from '../../search/search.component';
import { RecommendedRecentComponent } from '../../recommended-recent/recommended-recent.component';
import { AppsService } from '../../../services/services';
import { StoreApp, Channel } from '../../../models';
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
    private resultsChannels:Array<Channel>;

    public searchTerm:string;

    private appsPerPage:number = 9;
    private channelsPerPage:number = 3;
    private currentPage:number = 1;
    private currentPageChannels:number = 1;
    private totalPages:number = 0;
    private totalPagesChannels:number = 0;
    private activeOnly: boolean = true;

    public resultsCount:number = 0;
    public resultsCountChannels:number = 0;

    public searching:boolean = false;
    public searchingChannels:boolean = false;

    constructor( private _appsService:AppsService,
                 public router:Router,
                 params:RouteParams )
    {
        this.searching = true;
        this.searchingChannels = true;
        this.searchTerm = decodeURIComponent(params.get( 'searchterm' ));
        this.getResultsApps();
        this.getResultsChannels();
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

    getResultsChannels()
    {
        this.searchingChannels = true;
        this._appsService.getChannelsBySearchPaged(this.searchTerm, false, this.channelsPerPage, this.currentPageChannels)
                .subscribe(
                    results => {
                        this.resultsChannels = results.data;
                        this.resultsCountChannels = results.availableRows;
                        this.totalPagesChannels = Math.ceil(results.availableRows/this.channelsPerPage);
                        this.searchingChannels = false;
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
    }

    onPageClicked(page, isChannels) {
        if(!isChannels){
            this.currentPage = page;
            this.getResultsApps();
        } else {
            this.currentPageChannels = page;
            this.getResultsChannels();
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
