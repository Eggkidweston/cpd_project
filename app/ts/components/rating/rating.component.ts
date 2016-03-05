import { Component, Input, Output, EventEmitter } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { NgClass } from 'angular2/common';

@Component({
    selector: 'rating',
    template: require('./rating.component.html'),
    styles: [require('../../../sass/rating.scss').toString()],
    directives: [RouterOutlet, RouterLink, NgClass]
})
export class RatingComponent {
    @Input() rating: number;
    @Input() editable: boolean;
    @Output() ratingChanged = new EventEmitter();
    
    ratingClicked(rating: number) {
        if( this.editable ) {
            this.rating = rating;
            this.ratingChanged.emit(rating);
        }
    }
} 