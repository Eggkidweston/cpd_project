import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {ResourceMetrics} from 'models';
import {AppsService} from 'services/apps.service';
import {StoreApp} from 'models';
import {AppComponent} from '../../../app.component';
import {PeriodIndicator} from './period-indicator/period-indicator.component';

let Chart = require("chart.js");
let _ = require("underscore");
let moment = require("moment");

@Component({
    selector: 'resource-metrics',
    template: require('./resource-metrics.component.html'),
    styles: [require('./resource-metrics.component.scss').toString()],
    directives: [PeriodIndicator]
})
export class ResourceMetricsComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCavnas;

    private _resourceId:number;
    private resourceMetrics:ResourceMetrics;
    private resource:StoreApp;
    private remixedFromResource:StoreApp;

    constructor(protected appsService:AppsService,
                params:RouteParams) {
        this._resourceId = +params.get('id');
        this.loadResource();
    }

    ngAfterViewInit() {
        this.loadResourceMetrics();
    }

    protected loadResource() {
        this.appsService.getAppDetails(this._resourceId)
            .subscribe(
                app => this.resource = app,
                (error:any) => AppComponent.generalError(error.status)
            );

        this.appsService.getAppDetails(this._resourceId)
            .subscribe(
                app => this.remixedFromResource = app,
                (error:any) => AppComponent.generalError(error.status)
            );
    }

    protected loadResourceMetrics() {
        // set d to the first day of the next month
        var d = moment().add(1, 'M').date(1);

        this.appsService.getResourceMetrics(this._resourceId, moment().format("YYYY-MM"),
            (metrics:ResourceMetrics) => {
                var ctx = this.chartCavnas.nativeElement;
                var labels = new Array<string>();
                var data = new Array<number>();

                _.each(_.flatten(_.each(metrics, (monthMetrics) => monthMetrics.reverse())), (dayMetric) => {
                    data.unshift(dayMetric.total);
                    labels.unshift(d.subtract(1, 'd').format("MMM D"));
                });

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
            },
            (err) => console.log(`Error: ${JSON.stringify(err)}`));
    }
}