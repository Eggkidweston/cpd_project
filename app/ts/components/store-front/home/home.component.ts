import { Component } from '@angular/core';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { SearchComponent } from '../../search/search.component';
import { RecommendedRecentComponent } from '../../recommended-recent/recommended-recent.component';
import { AppsService } from '../../../services/services';
import { StoreApp } from '../../../models';
import { AppComponent } from '../../../app.component';
import { PaginationComponent } from './pagination/pagination.component';

@Component( {
    selector: 'home',
    template: require( './home.component.html' ),
    directives: [AppWidgetsComponent, SearchComponent, RecommendedRecentComponent, PaginationComponent]
} )
export class HomeComponent
{
    private recentApps:Array<StoreApp>;
    private recommendedApps:Array<StoreApp>;
    private appsPerPage:number = 20;
    private currentPage:number = 1;
    private totalPages:number = 0;

    constructor( private _appsService:AppsService )
    {
        this.getRecentApps();
        this.getRecommendedApps();
    }

    getRecentApps()
    {
        this._appsService.getRecentApps( this.appsPerPage, this.currentPage )
            .subscribe(
                recentApps => {
                    this.recentApps = recentApps.data;
                    this.totalPages = Math.ceil(recentApps.availableRows/this.appsPerPage);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    getRecommendedApps()
    {
        this._appsService.getRecommendedApps( this.appsPerPage, this.currentPage )
            .subscribe(
                recommendedApps => {
                console.log(recommendedApps.data);
                    this.recommendedApps = recommendedApps.data;
                    this.totalPages = Math.ceil(recommendedApps.availableRows/this.appsPerPage);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    onPageClicked(page) {
        this.currentPage = page;
        this.getRecentApps();
    }

}   