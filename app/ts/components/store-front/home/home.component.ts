import { Component } from '@angular/core';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { HeroCarouselComponent } from '../../hero-carousel/hero-carousel.component';
import { SearchComponent } from '../../search/search.component';
import { RecommendedRecentComponent } from '../../recommended-recent/recommended-recent.component';
import { AppsService } from '../../../services/services';
import { StoreApp, Collection } from '../../../models';
import { AppComponent } from '../../../app.component';
import { appSettings } from '../../../../../settings';

@Component( {
    selector: 'home',
    template: require( './home.component.html' ),
    styles: [require('./home.scss').toString()],
    directives: [AppWidgetsComponent, HeroCarouselComponent, SearchComponent, RecommendedRecentComponent]
} )
export class HomeComponent
{
    private mostDownloadedApps:Array<StoreApp>;
    private recentApps:Array<StoreApp>;
    private lastUpdatedApps:Array<StoreApp>;
    private recommendedApps:Array<StoreApp>;
    private activeOnly: boolean = true;
    private appsPerPage:number = 9;
    private currentPage:number = 1;
    private totalPages:number = 0;

    private totalResourceCount:number = 0;
    private totalCollectionCount:number = 0;

    idpToken:string;

    constructor( private _appsService:AppsService)
    {
        this.getResourceCount();
        this.getCollectionCount();
        this.getMostDownloadedApps();
        this.getRecentApps();
        this.getJiscPicks();
    }

    getResourceCount()
    {
        this._appsService.getResourceCount(this.activeOnly)
            .subscribe(
                resources => {
                    this.totalResourceCount = resources.availableRows;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    getCollectionCount()
    {
        this._appsService.getCollectionCount(this.activeOnly)
            .subscribe(
                collections => {
                    this.totalCollectionCount = collections.availableRows;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    getMostDownloadedApps()
    {
        this._appsService.getMostDownloadedApps( this.appsPerPage, this.currentPage )
            .subscribe(
                mostDownloadedApps => {
                    this.mostDownloadedApps = mostDownloadedApps.data;
                    this.totalPages = Math.ceil(mostDownloadedApps.availableRows/this.appsPerPage);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
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

    getCollectionAppResources(homeCollection: Collection){
        if(homeCollection.resourceids.length > 0) {
            let filter = "";
            for(let i = 0; i < homeCollection.resourceids.length; i++){
                filter += "(id eq '" + homeCollection.resourceids[i] +"')";
                if (i != homeCollection.resourceids.length - 1){
                    filter += " or ";
                }
            }

            this._appsService.getResourcesWithMedia( 99, 1, filter )
                .subscribe(
                    recommendedApps => {
                        this.recommendedApps = recommendedApps.data;
                        this.totalPages = Math.ceil(recommendedApps.availableRows/this.appsPerPage);
                    },
                    ( error:any ) => AppComponent.generalError( error.status )
                );
        }

    }

    getJiscPicks()
    {
      this._appsService.getRecentCollections( 1 )
        .subscribe(
            collection => {
                if(collection) {
                    this.getCollectionAppResources(collection[0]);
                }
              },
              ( error:any ) => AppComponent.generalError( error.status )
        );
    }
}
