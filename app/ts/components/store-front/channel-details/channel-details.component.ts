import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../../services/services';
import { AppsService } from '../../../services/services';
import { StoreApp, Channel } from '../../../models';
import { AppComponent } from '../../../app.component';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';

let moment = require( "moment" );

require( "../../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js" );

@Component( {
    selector: 'channel-details',
    template: require( './channel-details.component.html' ),
    styles: [require( '../app-details/app-details.scss' ).toString(), require('../../../../sass/typeimage.scss').toString()],
    directives: [RouterOutlet, RouterLink, AppWidgetsComponent]
} )

export class ChannelDetailsComponent implements AfterViewInit
{
    public channel:Channel;
    public resourceId:number;
    public channelApps:Array<StoreApp> = [];

    constructor( public authenticationService:AuthenticationService,
                 public router:Router,
                 public appsService:AppsService,
                 params:RouteParams )
    {
        this.resourceId = +params.get( 'id' );
    }


    ngAfterViewInit()
    {
        this.loadChannel();
    }

    loadChannel()
    {
        this.appsService.getChannelById( this.resourceId )
            .subscribe(
                channel =>
                {
                    this.channel = channel;
                    this.getChannelAppResources(channel);
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    getChannelAppResources(channel: Channel){
        if(channel.resourceids.length > 0) {
            let filter = "";
            for(let i = 0; i < channel.resourceids.length; i++){
                filter += "(id eq '" + channel.resourceids[i] +"')";
                if (i != channel.resourceids.length - 1){
                    filter += " or ";
                }
            }

            this.appsService.getResourcesWithMedia( 99, 1, filter )
                .subscribe(
                    channelApps => {
                        this.channelApps = channelApps.data;
                    },
                    ( error:any ) => AppComponent.generalError( error.status )
                );
        }
    }
}
