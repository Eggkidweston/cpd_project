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
    private hasIcon: boolean = false;
    private resourceTypeClass: string;

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
                    this.setIcon();
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

    downloadFileFromUrl(url: string) {
        if (url == null){
            this.urlError = true;
            return;
        }

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

    downloadEmbeddedResourceDocument(documentType) {
        if (documentType !== 'word' && documentType !== 'powerpoint') {
            return;
        }

        if( !this.authenticationService.userSignedIn() ) {
            this.openSignIn();
            return;
        }

        this.getting = true;
        this.appsService.getEmbeddedResourceDocument(this.resourceId, documentType)
            .subscribe(
                url => {
                    this.getting = false;
                    this.downloadFileFromUrl(url);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            )
    }

    retrieveAppAndDownload()
    {       
        this.getting = true;
        this.appsService.getApp( this.resourceId )
            .subscribe(
                url => {
                    this.getting = false;
                    this.downloadFileFromUrl(url);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
        
    }


    openSignIn()
    {
        this.router.navigate( ['SignIn'] );
    }

    setIcon()
    {
        if (this.app.image && this.app.image !== 'undefined'){
            this.hasIcon = true;
        }

        var type = this.app.type_id;
        if(type == 99){
            this.resourceTypeClass = 'backgroundimageother';
        }
        if(type === undefined){
            this.resourceTypeClass = 'backgroundimage-channel';
        }
        this.resourceTypeClass = 'backgroundimage' + type;
    }

//    onPageClicked(page) {
//        this.currentPage = page;
//        this.getResources();
//    }

}   