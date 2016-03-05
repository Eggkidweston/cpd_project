import { Component, Input } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { NgClass } from 'angular2/common';

@Component({
    selector: 'rating',
    template: require('./rating.component.html'),
    styles: [require('../../../sass/rating.scss').toString()],
    inputs: ["rating"],
    directives: [RouterOutlet, RouterLink, NgClass]
})
export class RatingComponent {
} 