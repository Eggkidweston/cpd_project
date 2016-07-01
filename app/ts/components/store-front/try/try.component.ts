import { Component, Input } from '@angular/core';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService, appSettings } from '../../../services/services';
import { AppsService } from '../../../services/services';
import { StoreApp, DownloadInstructions } from '../../../models';
import { AppComponent } from '../../../app.component';


@Component( {
    selector: 'try',
    template: require( './try.component.html' ),
    styles: [ require( './try.scss' ).toString()],
    directives: [AppWidgetsComponent, RouterOutlet, RouterLink]
} )


export class TryComponent
{
    public app:StoreApp;
    public resourceId:number;


    constructor( public authenticationService:AuthenticationService,
                 public router:Router,
                 public appsService:AppsService,
                 params:RouteParams )
    {
        this.resourceId = +params.get( 'id' );
        
    }

    ngAfterViewInit()
    {
        this.loadTryIt();
        //var url = this.app.trialurl;
    }

    loadTryIt()
    {
        this.appsService.getAppDetails( this.resourceId )
            .subscribe(
                storeApp =>
                {
                    this.app = storeApp;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }


    goBack()
    {
        this.router.navigate( ['AppDetails', { id: this.app.id }] );
    }

    openSignIn()
    {
        this.router.navigate( ['SignIn'] );
    }


}   