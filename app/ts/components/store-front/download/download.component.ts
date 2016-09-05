import { Component } from '@angular/core';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService, appSettings } from '../../../services/services';
import { AppsService } from '../../../services/services';
import { StoreApp, DownloadInstructions } from '../../../models';
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
        this.appsService.getDownloadInstructions( this.resourceId )
            .subscribe(
                downloadInstructions =>
                {
                    this.instructions = this.assignValbyType(downloadInstructions, "local");
                },
                ( error:any ) => AppComponent.generalError( error.status )

            );
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

    assignValbyType(instructions:DownloadInstructions, val:string){
        if(val=="local") {
            return instructions.local;
        } else {
            return "instructions.notlocal"
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