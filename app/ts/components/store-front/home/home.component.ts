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
    private storeApps:Array<StoreApp>;
    private appsPerPage:number = 20;
    private currentPage:number = 1;
    private totalPages:number = 0;

    constructor( private _appsService:AppsService )
    {
        this.getResources();
    }

    getResources()
    {
        this._appsService.getResources( this.appsPerPage, this.currentPage )
            .subscribe(
                storeApps => {
                    this.storeApps = storeApps.data;
                    this.totalPages = Math.ceil(storeApps.availableRows/this.appsPerPage);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    onPageClicked(page) {
        this.currentPage = page;
        this.getResources();
    }

    searchTermChanged(newSearchTerm) {
        console.log(newSearchTerm);
    }
}   