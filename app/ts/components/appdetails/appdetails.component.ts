import { Component, Input, AfterViewInit, ChangeDetectorRef } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { NgFor } from 'angular2/common';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { SubmitReviewComponent } from '../submitreview/submitreview.component';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { StoreApp } from '../../models';
import { AppComponent } from '../../app.component';
import { MediaCarouselComponent } from '../media-carousel/media-carousel.component';
import { Review } from '../../models';
import { LicenseType } from '../../models';
import { AppWidgetComponent } from '../appwidget/appwidget.component';

@Component({
  selector: 'app-details',
  template: require('./appdetails.component.html'),
  styles: [require('../../../sass/appdetails.scss').toString()],
  directives: [SubmitReviewComponent, RouterOutlet, RouterLink, RatingComponent, MediaCarouselComponent, AppWidgetComponent]
})
export class AppDetailsComponent implements AfterViewInit {
    public app: StoreApp;
    public resourceId: number;
    public reviews: Array<Review> = new Array<Review>();
    
    addingReview: boolean = false;
    
    constructor( public authenticationService: AuthenticationService, 
        public router: Router,
        public appsService: AppsService, 
        public cdr: ChangeDetectorRef,
        params: RouteParams ) 
    {
        this.resourceId = +params.get('id');
    }
    
    ngAfterViewInit() {
        this.loadApp();
        this.loadReviews();
    }
    
    loadApp() {
        this.appsService.getAppDetails( this.resourceId )
            .subscribe(
                storeApp => this.app = storeApp,
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadReviews() {
        this.appsService.getReviews( this.resourceId )
            .subscribe(
                reviews => this.reviews = reviews,
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    reviewAdded(review: Review) {
        // TODO We really ought to be able to just
        // push the review onto the array but for some
        // reason the description is not appearing.
        // this.reviews.push(review);
        // this.cdr.detectChanges();
        this.loadReviews();
    }
    
    getApp() {
        if(!this.authenticationService.userSignedIn) {
            this.openSignIn();
        } else {
            // waiting on API
            this.appsService.getApp( this.resourceId )
                .subscribe(
                    url => window.open(url),
                    (error: any) => AppComponent.generalError(error.status)
                );
        }
    }
    
    submitReview() {
        this.addingReview = true;
    }
    
    openSignIn() {
        this.router.navigate( ['SignIn'] );
    }
    
    get averageRating(): number {
        return this.app ? Math.floor(this.app.average_rating * 10) / 10 : 0;
    }
    
    get licenseType(): string {
        // for some reaosn, this does not work as a method on StoreApp. Grrr. TypeScript quirk.
        if( this.app ) return LicenseType[this.app.licensetype_id];
        else return "";
    }
}