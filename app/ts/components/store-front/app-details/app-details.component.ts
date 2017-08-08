import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RatingComponent } from '../../shared/rating/rating.component';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { SubmitReviewComponent } from './submit-review/submit-review.component';
import { AuthenticationService, ContributorService } from '../../../services/services';
import { appSettings } from '../../../../../settings';
import { AppsService } from '../../../services/services';
import { StoreApp, Review, Channel, ResourceProperty } from '../../../models';
import { AppComponent } from '../../../app.component';
import { LicenseTypes } from '../../../models';
import { AppWidgetComponent } from '../../appwidget/appwidget.component';
import { PreviewComponent } from './preview/preview.component';
import { SocialShareComponent } from '../../shared/social-share/social-share.component';
import { CategorySelectComponent } from './category-select/category-select.component';

let moment = require( "moment" );

require( "../../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js" );

@Component( {
    selector: 'app-details',
    template: require( './app-details.component.html' ),
    styles: [require( './app-details.scss' ).toString(), require('../../../../sass/typeimage.scss').toString()],
    directives: [SubmitReviewComponent, RouterOutlet, RouterLink, RatingComponent, PreviewComponent, AppWidgetComponent, SocialShareComponent, CategorySelectComponent]
} )

export class AppDetailsComponent implements AfterViewInit
{
    public app:StoreApp;
    public resourceId:number;
    public alsoBy:Array<StoreApp>;
    public relatedChannels:Array<Channel>;
    public reviews:Array<Review> = new Array<Review>();
    public widgetBackground:string;
    public widgetIcon:string;
    public errorMessage:string;
    public fileList:Array<string>;
    private resourceUseTypes:Array<ResourceProperty> = [];
    private resourceLevels:Array<ResourceProperty> = [];
    private resourceSubjects:Array<ResourceProperty> = [];
    addingReview:boolean = false;

    resourceNoCategories: boolean = false;
    forceDisplayCategories: boolean = false;

    constructor( public authenticationService:AuthenticationService,
                 private contributorService:ContributorService,
                 public router:Router,
                 public appsService:AppsService,
                 params:RouteParams )
    {
        this.resourceId = +params.get( 'id' );
    }


    ngAfterViewInit()
    {
        this.loadApp();
        this.loadReviews();
    }

    loadApp()
    {
        this.appsService.getAppDetails( this.resourceId )
            .subscribe(
                storeApp =>
                {
                    this.app = storeApp;

                    let jorum_legacy_lastmodified = moment(this.app.jorum_legacy_lastmodified);
                    this.app.jorum_legacy_lastmodified = jorum_legacy_lastmodified.format("D MMM YYYY");

                    this.fileList = this.getFileListFromMetadata(this.app.jorum_legacy_metadata);

                    this.setWidgetBackground();
                    this.setWidgetIcon();

                    this.loadAlsoBy();

                    this.loadRelatedChannels();
                    this.loadResourceUseTypes();
                    this.loadResourceLevels();
                    this.loadResourceSubjects();
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    goCuration()
    {
      //work around until we get a token checking endpoint
      if(this.authenticationService.userSignedIn()) {
        this.contributorService.getContributorById( AuthenticationService.user.id )
            .subscribe(
                contributor =>
                {
                  //console.log('logged in');
                    //definitely logged in
                    var url = `${appSettings.curationRoot}#/resource/${this.app.id}?token=${AuthenticationService.apiKey}`;
                    window.location.href = url;
                },
                ( error:any ) => {
                  //console.log('error getting contributor - sign in');
                   this.router.navigate( ['SignIn'] );
               }
            );
      }else{
        //console.log('not signed in - sign in');
          this.router.navigate( ['SignIn'] );
      }
    }



    loadReviews()
    {
        this.appsService.getReviews( this.resourceId )
            .subscribe(
                reviews => this.reviews = reviews,
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadAlsoBy()
    {
        this.appsService.getByCreator( this.app.createdby )
            .subscribe(
                alsoBy => this.alsoBy = alsoBy.filter( app => this.app.id != app.id ),
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    loadRelatedChannels()
    {
      this.appsService.getChannelsByResourceId(this.app.id)
          .subscribe(
              filteredList => {
                  this.relatedChannels = filteredList;
              },
              (error:any) => AppComponent.generalError( error.status )
          );
    }

    loadResourceUseTypes()
    {
        this.appsService.getUseTypesByResourceId(this.app.id)
            .subscribe(
                resourceUseTypes => {
                    this.resourceUseTypes = resourceUseTypes;
                    this.resourceNoCategories = this.checkResourceCategories();
                },
                (error:any) => AppComponent.generalError( error.status )
            );
    }

    loadResourceLevels()
    {
        this.appsService.getLevelsByResourceId(this.app.id)
            .subscribe(
                resourceLevels => {
                    this.resourceLevels = resourceLevels;
                    this.resourceNoCategories = this.checkResourceCategories();
                },
                (error:any) => AppComponent.generalError( error.status )
            );
    }

    loadResourceSubjects()
    {
        this.appsService.getSubjectsByResourceId(this.app.id)
            .subscribe(
                resourceSubjects => {
                    this.resourceSubjects = resourceSubjects;
                    this.resourceNoCategories = this.checkResourceCategories();
                },
                (error:any) => AppComponent.generalError( error.status )
            );
    }

    checkResourceCategories() {
        return this.resourceUseTypes.length === 0 &&
               this.resourceLevels.length === 0 &&
               this.resourceSubjects.length === 0;
    }

    reviewAdded( review:Review )
    {
        // TODO We really ought to be able to just
        // push the review onto the array but for some
        // reason the description is not appearing.
        // this.reviews.push(review);
        // this.cdr.detectChanges();
        this.loadReviews();
    }

    goTry()
    {
        this.router.navigate( ['Try', { id: this.resourceId }] );
    }

    goDownload()
    {
        this.router.navigate( ['Download', { id: this.resourceId }] );
    }

    submitReview()
    {
        this.addingReview = true;
    }

    openSignIn()
    {
        this.router.navigate( ['SignIn'] );
    }

    get averageRating():number
    {
        return this.app ? Math.floor( this.app.average_rating * 10 ) / 10 : 0;
    }

    get licenseType():string
    {
        // for some reason, this does not work as a method on StoreApp. Grrr. TypeScript quirk.
        if( this.app ) return LicenseTypes[this.app.licensetype_id];
        else return "";
    }

    setWidgetBackground()
    {
        if(!this.app.image || this.app.image === 'undefined') {
            this.widgetBackground = "backgroundimage" + this.app.type_id + " nowidgetborder";
        }
    }

    setWidgetIcon()
    {
        if(!this.app.image && this.app.jorum_legacy_flag) {
            this.widgetIcon = "https://s3-eu-west-1.amazonaws.com/jisc-store-assets/jorumicon.png";
        } else if (this.app.image !== 'undefined') {
            this.widgetIcon = this.app.image;
        }
    }

    getFileListFromMetadata(metadata):Array<string>
    {
        if(metadata === null||typeof metadata === 'object') {
            this.app.jorum_legacy_metadata = null;
            return new Array();
        } else {
            let fullFileList = JSON.parse(metadata) as Array<string>;
            let partialList = fullFileList.slice(0,10);
            if(fullFileList.length>10) {
                let additionalFileNumber = fullFileList.length - 10;
                partialList.push('+ ' + additionalFileNumber.toString() + ' other files');
            }
            return partialList;
        }
    }

    refreshCategories(event){
        this.forceDisplayCategories = true;
        this.resourceSubjects = event.resourceCategories.subjects;
        this.resourceUseTypes = event.resourceCategories.usetypes;
        this.resourceLevels = event.resourceCategories.levels;
    }
}
