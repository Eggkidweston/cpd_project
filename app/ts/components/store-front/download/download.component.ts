import { Component, ViewChild } from '@angular/core';
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
    private resUrl : String = null;
    private getting :boolean = false;
    private urlError :boolean = false;
    private isUploadedResource: boolean = false;
    private isCCLicence: boolean = false;

    protected resourceInstructions = ResourceInstructions;

    @ViewChild( 'filedownloadButton' ) filedownloadButton;

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
                    this.displayDownloadLinkForCC();
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

    displayDownloadLinkForCC() 
    {
        if(this.app.licensetype_id>=4&&this.app.licensetype_id<=10) {
            this.isCCLicence = true;
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
            this.retrieveAppAndDownload();
        }
    }

    getAppWithoutLogin()
    {
        this.retrieveAppAndDownload();
    }

    retrieveAppAndDownload()
    {       
        this.getting = true;
        this.appsService.getApp( this.resourceId )
            .subscribe(
                url => {
                    this.getting = false;
                    if (url == null){
                        this.urlError = true;
                    }
                    else{
                        this.resUrl = url;

                        this.filedownloadButton.nativeElement.setAttribute("href", url);
                        
                        
                        let resourceURL:string = url;
                        if(resourceURL.indexOf('jisc-store-resources')==-1&&resourceURL.indexOf('jisc-store-content')==-1) {
                            //not hosted on our s3 bucket
                        }else {
                            this.isUploadedResource = true;
                            this.filedownloadButton.nativeElement.setAttribute("download", url);
                        }
                        
                        this.filedownloadButton.nativeElement.click();
                    }

                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
        
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