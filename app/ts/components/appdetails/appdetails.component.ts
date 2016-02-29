import { Component } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { SubmitReviewComponent } from '../submitreview/submitreview.component';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-details',
  template: require('./appdetails.component.html'),
  styles: [require('../../../sass/appdetails.scss').toString()],
  directives: [SubmitReviewComponent, RouterOutlet, RouterLink, RatingComponent]
})
export class AppDetailsComponent {
    addingReview: boolean = false;
    
    constructor( public authenticationService: AuthenticationService) {}
    
    submitReview() {
        this.addingReview = true;
    }
}