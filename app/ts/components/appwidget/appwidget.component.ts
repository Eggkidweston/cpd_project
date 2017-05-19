import { Component, Input } from '@angular/core';
import { RatingComponent } from '../shared/rating/rating.component';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { StoreApp } from '../../models';

@Component({
  selector: 'app-widget',
  template: require('./appwidget.component.html'),
  styles: [require('../../../sass/appwidget.scss').toString(), require('../../../sass/typeimage.scss').toString()],
  directives: [RouterOutlet, RouterLink, RatingComponent]
})
export class AppWidgetComponent {
    @Input() app: StoreApp;
    public noimagestyle:string;
    public hasMedia: boolean;
    
    //appTitleToFit(appTitle: String) {
    //	return (appTitle.length>18) ? (appTitle.substr(0, 16)+'...') : appTitle;
    //}

    ngOnInit(){
      if(this.app.media && this.app.media.length > 0) {
        this.hasMedia = true;
      }
    }

    get widgetTypeIcon():string
    {
    	if(!this.app.image) {
    		return "backgroundimage" + this.app.type_id;
    	}
    	return "";
    }

}
