import { Component } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
  selector: 'app-widget',
  template: require('./appwidget.component.html'),
  directives: [RouterOutlet, RouterLink, RatingComponent]
})
export class AppWidgetComponent {
}