import {Component} from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
  selector: 'app-widget',
  template: require('./appwidget.component.html'),
  directives: [RouterOutlet, RouterLink]
})
export class AppWidgetComponent {
}