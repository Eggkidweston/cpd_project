import { Component } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
  selector: 'app-details',
  template: require('./appdetails.component.html'),
  styles: [require('../../../sass/appdetails.scss').toString()],
  directives: [RouterOutlet, RouterLink, RatingComponent]
})
export class AppDetailsComponent {
}