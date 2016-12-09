import { Component } from '@angular/core';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../../services/services';
import { appSettings } from '../../../../../settings';
import { AppsService } from '../../../services/services';
import { StoreApp, ResourceInstructions } from '../../../models';
import { AppComponent } from '../../../app.component';

@Component( {
    selector: 'download',
    template: require( './download.component.html' ),
    styles: [ require( './download.scss' ).toString()],
    directives: [AppWidgetsComponent, RouterOutlet, RouterLink]
} )
export class DownloadComponent
{
    public app:StoreApp;
    public instructions:String;
    public resourceId:number;
    protected resourceInstructions = ResourceInstructions;

    constructor( public authenticationService:AuthenticationService,
                 public router:Router,
                 public appsService:AppsService,
                 params:RouteParams )
    {
        this.resourceId = +params.get( 'id' );
    }

    ngAfterViewInit()
    {
        this.loadApp();

    }

    loadApp()
    {
        this.appsService.getAppDetails( this.resourceId )
            .subscribe(
                storeApp =>
                {
                    this.app = storeApp;
                    this.loadInstructions();
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadInstructions()
    {
        if(this.app.type_id==99) //other
        {
            this.instructions = "We are not sure what type of resource this is! Please let us know either in the reviews or by contacting support."
        } else {
            this.instructions = this.resourceInstructions[this.app.type_id - 1];
        }
        
    }

    goBack()
    {
        this.router.navigate( ['AppDetails', { id: this.app.id }] );
    }

    getApp()
    {
        if( !this.authenticationService.userSignedIn() ) {
            this.openSignIn();
        } else {
            this.appsService.getApp( this.resourceId )
                .subscribe(
                    url => window.open( url ),
                    ( error:any ) => AppComponent.generalError( error.status )
                );
        }
    }


    openSignIn()
    {
        this.router.navigate( ['SignIn'] );
    }

//    onPageClicked(page) {
//        this.currentPage = page;
//        this.getResources();
//    }

}   