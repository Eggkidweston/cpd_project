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
    public typeImage: boolean;
    public isChannel: boolean;
    public resourceLink: string;

    constructor(public router:Router){}

    ngOnInit(){
      if(this.app.media && this.app.media.length > 0){
        this.hasMedia = true;
      } else if(this.app.type_id === 3){
        this.typeImage = true;
      }

      this.isChannel = this.app.type_id == null;

      if(this.isChannel){
        this.resourceLink = "ChannelDetails"
      } else {
        this.resourceLink = "AppDetails"
      }
    }

    get widgetTypeIcon():string
    {
    	if(!this.app.image) {
        if(!this.app.type_id){
          return "backgroundimage-channel";
        }
    		return "backgroundimage" + this.app.type_id;
    	}
    	return "";
    }
}
