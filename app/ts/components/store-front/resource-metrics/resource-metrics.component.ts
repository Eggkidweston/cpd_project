import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouteParams, RouterOutlet, RouterLink, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ResourceMetrics } from 'models';
import { AppsService } from 'services/apps.service';
import { StoreApp } from 'models';
import { AppComponent } from '../../../app.component';
import { PeriodIndicator } from './period-indicator/period-indicator.component';
import { Observable } from 'rxjs/Observable';

let Chart = require( "chart.js" );
let _ = require( "underscore" );
let moment = require( "moment" );

@Component( {
    selector: 'resource-metrics',
    template: require( './resource-metrics.component.html' ),
    styles: [require( './resource-metrics.component.scss' ).toString(), require('../../../../sass/typeimage.scss').toString()],
    directives: [PeriodIndicator]
} )
export class ResourceMetricsComponent implements AfterViewInit {
    @ViewChild( 'chartCanvas' ) chartCavnas;

    private _resourceId:number;
    private resourceMetrics:ResourceMetrics;
    private resource:StoreApp;
    private remixedFromResource:StoreApp;
    public widgetBackground:string;
    public widgetIcon:string;

    constructor( protected appsService:AppsService,
                public router:Router,
                 params:RouteParams ) {
        this._resourceId = +params.get( 'id' );
        this.loadResource();
    }

    ngAfterViewInit() {
        
    }

    protected loadResource() {
        this.appsService.getAppDetails( this._resourceId )
            .subscribe(
                app => {    
                    this.resource = app;
                    this.setWidgetBackground();
                    this.setWidgetIcon();

                    this.loadResourceMetrics();
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );

        this.appsService.getAppDetails( this._resourceId )
            .subscribe(
                app => this.remixedFromResource = app,
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    protected loadResourceMetrics() {
        // set d to the first day of the next month
        var d = moment().add( 1, 'M' ).date( 1 );

        this.appsService.getResourceMetrics( this._resourceId, moment().format( "YYYY-MM" ),
            ( metrics:ResourceMetrics ) => {
                if(this.chartCavnas) {
                    var ctx = this.chartCavnas.nativeElement;
                    var labels = new Array<string>();
                    var data = new Array<number>();

                    _.each( _.flatten( _.each( metrics, ( monthMetrics ) => monthMetrics.reverse() ) ), ( dayMetric ) => {
                        data.unshift( dayMetric.total );
                        labels.unshift( d.subtract( 1, 'd' ).format( "MMM D" ) );
                    } );

                    Chart.defaults.global.legend.display = false;

                    var myChart = new Chart( ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: "rgb(169, 33, 115)"
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    } );
                }
            },
            ( err ) => Observable.throw( `Error: ${JSON.stringify( err )}` ) );
    }

    setWidgetBackground() 
    {
        if(!this.resource.image) {
            this.widgetBackground = "backgroundimage" + this.resource.type_id + " nowidgetborder";
        }
    }

    setWidgetIcon() 
    {
        if(!this.resource.image&&this.resource.jorum_legacy_flag) {
            this.widgetIcon = "https://s3-eu-west-1.amazonaws.com/jisc-store-content/jorumicon.png";
        } else {
            this.widgetIcon = this.resource.image;
        }
    }

    goBack()
    {
        this.router.navigate( ['AppDetails', { id: this.resource.id }] );
    }

}