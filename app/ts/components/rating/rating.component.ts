import { Component } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
    selector: 'rating',
    template: require('./rating.component.html'),
    styles: [require('../../../sass/rating.scss').toString()],
    directives: [RouterOutlet, RouterLink]
})
export class RatingComponent {
}