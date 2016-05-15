import {Component} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {ContributorService} from 'services/services';
import {AppComponent} from 'app.component';
import {AppWidgetComponent} from 'appwidget/appwidget.component';
import {Contributor} from 'models';
import {AgoPipe} from 'ago.pipe.ts';
import {Router} from '@angular/router-deprecated';
import {AuthenticationService} from "../../../services/services";

@Component({
    selector: 'contributor',
    template: require('./contributor.component.html'),
    styles: [require('./contributor.component.scss').toString()],
    pipes: [AgoPipe],
    directives: [AppWidgetComponent]
})
export class ContributorComponent {
    private _contributorId:number;
    private _contributor:Contributor;

    constructor(protected authenticationService:AuthenticationService,
                protected router:Router,
                protected contributorService:ContributorService,
                params:RouteParams)
    {
        if (this.isProfile) {
            if (!this.authenticationService.userSignedIn) {
                this.router.navigate(['SignIn'])
            }
            else {
                this._contributorId = this.authenticationService.user.id;
            }
        }
        else {
            this._contributorId = +params.get('id');
        }
        this.loadContributor();
    }

    get contributor():Contributor {
        return this._contributor;
    }

    isProfile():boolean {
        return this.router.isRouteActive(AppComponent.router.generate(['Profile']));
    }

    protected loadContributor():void {
        this.contributorService.getContributorById(this._contributorId)
            .subscribe(
                contributor => this._contributor = contributor,
                (error:any) => AppComponent.generalError(error.status)
            );
    }
}