import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { SubmitReviewComponent } from '../submitreview/submitreview.component';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { StoreApp } from '../../models';
import { ShadowApp } from '../../models';
import { AppComponent } from '../../app.component';
import { Review } from '../../models';
import { LicenseType } from '../../models';
import { AppWidgetComponent } from '../appwidget/appwidget.component';
import { MediaCarouselComponent } from '../store-front/media-carousel/media-carousel.component';


require( "../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js" );

@Component( {
    selector: 'app-details',
    template: require( './appdetails.component.html' ),
    styles: [require( '../../../sass/appdetails.scss' ).toString(),
        require( '../store-front/media-carousel/media-carousel.scss' ).toString()],
    directives: [SubmitReviewComponent, RouterOutlet, RouterLink, RatingComponent, MediaCarouselComponent, AppWidgetComponent]
} )
export class AppDetailsComponent implements AfterViewInit
{
    public app:StoreApp;
    public shadowApps:ShadowApp[] = [];
    public shadowApp:ShadowApp;
    public resourceId:number;
    public alsoBy:Array<StoreApp>;
    public reviews:Array<Review> = new Array<Review>();

    public errorMessage:string;

    addingReview:boolean = false;

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
        this.loadReviews();
    }

    loadApp()
    {
        this.appsService.getAppDetails( this.resourceId )
            .subscribe(
                storeApp =>
                {
                    this.app = storeApp;
                    console.log(`App JSON: ${JSON.stringify(this.app.media)}`);
                    this.loadAlsoBy();
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    goTry()
    {

        var url = this.shadowApp.runURL


        // window.location.href=url;

    }

    goCuration()
    {

        var url = 'http://curation-staging.data.alpha.jisc.ac.uk/#/curation/' + this.app.id


        window.location.href = url;

    }

    goDownloadSource() { }

    goLicenseType() { }

    getShadow()
    {

        this.shadowApp = this.shadowApps[0];

        for( var medium of this.shadowApp.media ) {
            if( medium.type_id == '2' ) {
                var index = medium.url.lastIndexOf( "/" );
                var youTubeId = medium.url.substr( index + 1 );
                medium.previewUrl = `http://img.youtube.com/vi/${ youTubeId }/0.jpg`;
            } else {
                medium.previewUrl = medium.url;
            }
        }

        this.shadowApp.media[1] = this.shadowApp.media[0];
        this.shadowApp.media[2] = this.shadowApp.media[0];
        this.shadowApp.media[3] = this.shadowApp.media[0];
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

    reviewAdded( review:Review )
    {
        // TODO We really ought to be able to just
        // push the review onto the array but for some
        // reason the description is not appearing.
        // this.reviews.push(review);
        // this.cdr.detectChanges();
        this.loadReviews();
    }

    getApp()
    {
        if( !this.authenticationService.userSignedIn ) {
            this.openSignIn();
        } else {
            this.appsService.getApp( this.resourceId )
                .subscribe(
                    url => window.open( url ),
                    ( error:any ) => AppComponent.generalError( error.status )
                );
        }
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
        if( this.app ) return LicenseType[this.app.licensetype_id];
        else return "";
    }


}