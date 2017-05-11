import {Component, Input, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {RatingComponent} from '../shared/rating/rating.component';
import {
    RouterOutlet,
    RouterLink,
    RouteConfig,
    RouteParams,
    Router,
    ROUTER_DIRECTIVES
} from '@angular/router-deprecated';
import {AuthenticationService} from '../../services/services';
import {AppsService} from '../../services/services';
import {StoreApp, TagCloud, Tag} from '../../models';
import {AppComponent} from '../../app.component';


import {AppWidgetsComponent} from '../appwidgets/appwidgets.component';


require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'collections',
    template: require('collections.component.html'),
    styles: [require('../../../sass/explore.scss').toString()],

    directives: [AppWidgetsComponent, RouterOutlet, RouterLink, RatingComponent]
})
export class CollectionsComponent implements AfterViewInit {

    private storeApps: Array<StoreApp>;
    public errorMessage: string;

    public tagcloud: TagCloud;
    public selectedTags: TagCloud;
    public chosenOrder: string;
    private queryTags: string;
    public resultsCount:number = 0;

    constructor(public authenticationService: AuthenticationService,
                public router: Router,
                public appsService: AppsService,
                public cdr: ChangeDetectorRef,
                params: RouteParams) {
    }

    ngAfterViewInit() {

    }


}
