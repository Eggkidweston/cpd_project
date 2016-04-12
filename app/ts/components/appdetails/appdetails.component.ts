import { Component, Input, AfterViewInit, ChangeDetectorRef } from 'angular2/core';
import { RatingComponent } from '../rating/rating.component';
import { NgFor } from 'angular2/common';
import { NgIf} from 'angular2/common';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { SubmitReviewComponent } from '../submitreview/submitreview.component';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { Apps2Service } from '../../services/apps2.service.ts';
import { StoreApp } from '../../models';
import { ShadowApp } from '../../models';
import { AppComponent } from '../../app.component';
import { Review } from '../../models';
import { LicenseType } from '../../models';
import { AppWidgetComponent } from '../appwidget/appwidget.component';
import { MediaCarouselComponent } from '../media-carousel/media-carousel.component';


require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'app-details',
    template: require('./appdetails.component.html'),
    styles: [require('../../../sass/appdetails.scss').toString(),
        require('../../../sass/media-carousel.scss').toString()],

    directives: [SubmitReviewComponent, RouterOutlet, RouterLink, RatingComponent,MediaCarouselComponent, AppWidgetComponent]
})
export class AppDetailsComponent implements AfterViewInit {
    public app: StoreApp;
    public shadowApps: ShadowApp[] = [];
    public shadowApp: ShadowApp;
    public resourceId: number;
    public alsoBy: Array<StoreApp>;
    public reviews: Array<Review> = new Array<Review>();

    public errorMessage:string;

    addingReview: boolean = false;

    constructor(public authenticationService: AuthenticationService,
        public router: Router,
        public appsService: AppsService, public apps2Service: Apps2Service,
        public cdr: ChangeDetectorRef,
        params: RouteParams) {
        this.resourceId = +params.get('id');
    }

    ngAfterViewInit() {
        this.loadApp();
        this.loadReviews();
    }

    loadApp() {
        this.appsService.getAppDetails(this.resourceId)
            .subscribe(
            storeApp => {
                this.app = storeApp;
                this.loadAlsoBy();
            },
            (error: any) => AppComponent.generalError(error.status)
            );

       this.apps2Service.getApp(this.resourceId)
            .subscribe(
                shadowApps => {
                    this.shadowApps = shadowApps,
                        this.getShadow()
                },
                (error: any) =>  this.errorMessage = <any>error
            );

    }

    goTry(){

        var url = this.shadowApp.runURL


        window.location.href=url;

    }

    goCuration(){

        var url = 'http://curation-staging.data.alpha.jisc.ac.uk/#/curation/'+this.app.id


        window.location.href=url;

    }

    goDownloadSource(){}

    goLicenseType(){}

    getShadow()
    {

        this.shadowApp=this.shadowApps[0];
        console.log(this.shadowApps);

    }



    loadReviews() {
        this.appsService.getReviews(this.resourceId)
            .subscribe(
            reviews => this.reviews = reviews,
            (error: any) => AppComponent.generalError(error.status)
            );
    }

    loadAlsoBy() {
        this.appsService.getByCreator(this.app.createdby)
            .subscribe(
            alsoBy => this.alsoBy = alsoBy.filter( app => this.app.id != app.id ),
            (error: any) => AppComponent.generalError(error.status)
            );
    }

    reviewAdded(review: Review) {
        // TODO We really ought to be able to just
        // push the review onto the array but for some
        // reason the description is not appearing.
        // this.reviews.push(review);
        // this.cdr.detectChanges();
        this.loadReviews();
    }

    getApp() {
        if (!this.authenticationService.userSignedIn) {
            this.openSignIn();
        } else {
            this.appsService.getApp(this.resourceId)
                .subscribe(
                url => window.open(url),
                (error: any) => AppComponent.generalError(error.status)
                );
        }
    }

    submitReview() {
        this.addingReview = true;
    }

    openSignIn() {
        this.router.navigate(['SignIn']);
    }

    get averageRating(): number {
        return this.app ? Math.floor(this.app.average_rating * 10) / 10 : 0;
    }

    get licenseType(): string {
        // for some reaosn, this does not work as a method on StoreApp. Grrr. TypeScript quirk.
        if (this.app) return LicenseType[this.app.licensetype_id];
        else return "";
    }


}