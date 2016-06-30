import { Component, Input } from '@angular/core';
import { RatingComponent } from '../shared/rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Resource } from '../../models';

@Component({
  selector: 'app-widget',
  template: require('./appwidget.component.html'),
  styles: [require('../../../sass/appwidget.scss').toString()],
  directives: [RouterOutlet, RouterLink, RatingComponent]
})
export class AppWidgetComponent {
    @Input() app: Resource;
    public noimagestyle:string;

    //appTitleToFit(appTitle: String) {
    //	return (appTitle.length>18) ? (appTitle.substr(0, 16)+'...') : appTitle;
    //}

    get widgetBackground():string 
    {
    	if(!this.app.image) {
    		return "backgroundimage";
    	}
    	return "";
    }
}