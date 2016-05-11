import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';
import { ResourceMetrics } from 'models';
import { AppsService } from 'services/apps.service';
import { Apps2Service } from 'services/apps2.service';
import { StoreApp } from 'models';
import { AppComponent } from '../../../app.component';

let Chart = require("chart.js");
let _ = require("underscore");
let moment = require("moment");

@Component({
    selector: 'resource-metrics',
    template: require('./resource-metrics.component.html'),
    styles: [require('./resource-metrics.component.scss').toString()]
})
export class ResourceMetricsComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCavnas;

    private _resourceId:number;
    private _resourceMetrics:ResourceMetrics;
    private resource:StoreApp;
    private remixedFromResource:StoreApp;
    private todayCount: number;
    private weekCount: number;
    private monthCount: number;

    constructor(protected apps2Service:Apps2Service,
                protected appsService:AppsService,
                params:RouteParams)
    {
        this._resourceId = +params.get('id');
        this.loadResource();
        this.loadResourceMetrics();
        this.todayCount = 37;
        this.weekCount = 229;
        this.monthCount = 872;
    }

    ngAfterViewInit() {
        var ctx = this.chartCavnas.nativeElement;
        var now = moment();
        var labels = new Array<string>();
        var data = new Array<number>();

        // randomize
        for( var i = 0; i < 13; i++ ) labels.unshift( now.add(-7, "d").format("MMM D") );
        for( var i = 0; i < 31; i++ ) data.push( Math.floor(Math.random() * 50) );
        
        Chart.defaults.global.legend.display = false;

        var myChart = new Chart(ctx, {
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
        });
    }

    protected loadResource() {
        this.appsService.getAppDetails(this._resourceId)
            .subscribe(
                app => this.resource = app,
                (error: any) => AppComponent.generalError(error.status)
            );

        this.appsService.getAppDetails(this._resourceId)
            .subscribe(
                app => this.remixedFromResource = app,
                (error: any) => AppComponent.generalError(error.status)
            );
    }

    protected loadResourceMetrics() {
        this._resourceMetrics = this.appsService.getResourceMetrics(this._resourceId);
    }
}