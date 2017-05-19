import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../../services/services';
import { AppsService } from '../../../services/services';
import { StoreApp, Collection } from '../../../models';
import { AppComponent } from '../../../app.component';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';

let moment = require( "moment" );

require( "../../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js" );

@Component( {
    selector: 'collection-details',
    template: require( './collection-details.component.html' ),
    styles: [require( '../app-details/app-details.scss' ).toString(), require('../../../../sass/typeimage.scss').toString()],
    directives: [RouterOutlet, RouterLink, AppWidgetsComponent]
} )

export class CollectionDetailsComponent implements AfterViewInit
{
    public collection:Collection;
    public resourceId:number;
    public collectionApps:Array<StoreApp> = [];

    constructor( public authenticationService:AuthenticationService,
                 public router:Router,
                 public appsService:AppsService,
                 params:RouteParams )
    {
        this.resourceId = +params.get( 'id' );
    }


    ngAfterViewInit()
    {
        this.loadCollection();
    }

    loadCollection()
    {
        this.appsService.getCollectionById( this.resourceId )
            .subscribe(
                collection =>
                {
                    this.collection = collection;
                    this.getCollectionAppResources(collection);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    getCollectionAppResources(collection: Collection){
        if(collection.resourceids.length > 0) {
            let filter = "";
            for(let i = 0; i < collection.resourceids.length; i++){
                filter += "(id eq '" + collection.resourceids[i] +"')";
                if (i != collection.resourceids.length - 1){
                    filter += " or ";
                }
            }

            this.appsService.getResourcesWithMedia( 99, 1, filter )
                .subscribe(
                    collectionApps => {
                        this.collectionApps = collectionApps.data;
                    },
                    ( error:any ) => AppComponent.generalError( error.status )
                );
        }
    }
}
