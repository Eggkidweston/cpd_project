import { Component, Input } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { StoreApp } from '../../models';

@Component({
  selector: 'app-widget',
  template: require('./appwidget.component.html'),
  styles: [require('../../../sass/appwidget.scss').toString()],
  directives: [RouterOutlet, RouterLink, RatingComponent]
})
export class AppWidgetComponent {
    @Input() app: StoreApp;

    appTitleToFit(appTitle: String) {
    	return (appTitle.length>18) ? (appTitle.substr(0, 16)+'...') : appTitle;
    }
}