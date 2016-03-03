import { Component, Input } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { NgFor } from 'angular2/common';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { SubmitReviewComponent } from '../submitreview/submitreview.component';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { StoreApp } from '../../models';
import { AppComponent } from '../../app.component';
import { Review } from '../../models';

@Component({
  selector: 'app-details',
  template: require('./appdetails.component.html'),
  styles: [require('../../../sass/appdetails.scss').toString()],
  directives: [SubmitReviewComponent, RouterOutlet, RouterLink, RatingComponent]
})
export class AppDetailsComponent {
    public app: StoreApp;
    public resourceId: number;
    public reviews: Array<Review>;
    
    addingReview: boolean = false;
    
    constructor( public authenticationService: AuthenticationService, public appsService: AppsService, params: RouteParams ) {
        this.resourceId = +params.get('id');
        
        this.appsService.getApp( this.resourceId )
            .subscribe(
                storeApp => this.app = storeApp,
                (error: any) => AppComponent.generalError(error.status)
            );
        
        this.appsService.getReviews( this.resourceId,
            reviews => this.reviews = reviews,
            (error: any) => AppComponent.generalError(error.status)
        );
    }
    
    reviewAdded(review: Review) {
        //this.reviews.push(review);
    }
    
    submitReview() {
        this.addingReview = true;
    }
}