import {Component} from '@angular/core';
import {AppWidgetsComponent} from '../appwidgets/appwidgets.component';
import {SearchComponent} from '../search/search.component';
import {RecommendedRecentComponent} from '../recommended-recent/recommended-recent.component';
import {AppsService} from '../../services/services';
import {StoreApp} from '../../models';
import {AppComponent} from '../../app.component';

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    styles: [require('../../../sass/home.scss').toString()],
    directives: [AppWidgetsComponent, SearchComponent, RecommendedRecentComponent]
})
export class HomeComponent {
    private storeApps:Array<StoreApp>;

    constructor(private _appsService:AppsService) {
        this.getSomeApps();
    }

    getSomeApps() {
        this._appsService.getAllApps()
            .subscribe(
                storeApps => this.storeApps = storeApps,
                (error:any) => AppComponent.generalError(error.status)
            );
    }

    recentSelected() {
        this._appsService.getRecentApps()
            .subscribe(
                storeApps => this.storeApps = storeApps,
                (error:any) => AppComponent.generalError(error.status)
            );
    }

    recommendedSelected() {
        this._appsService.getRecommendedApps()
            .subscribe(
                storeApps => this.storeApps = storeApps,
                (error:any) => AppComponent.generalError(error.status)
            );
    }
}   