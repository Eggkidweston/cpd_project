import { Component, Input } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { StoreApp } from '../../models';

@Component({
  selector: 'app-widget',
  template: require('./appwidget.component.html'),
  styles: [require('../../../sass/appwidget.scss').toString()],
  directives: [RouterOutlet, RouterLink, RatingComponent]
})
export class AppWidgetComponent {
    @Input() app: StoreApp;
}