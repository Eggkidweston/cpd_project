import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { ContributorService } from '../../services/services';
import { AppComponent } from '../../app.component';
import { AppWidgetComponent } from '../appwidget/appwidget.component';
import { Contributor } from '../../models';
import { AgoPipe } from 'ago.pipe';

@Component({
    selector: 'contributor',
    template: require('./contributor.component.html'),
    styles: [require('./contributor.component.scss').toString()],
    pipes: [ AgoPipe ],
    directives: [ AppWidgetComponent ] 
})
export class ContributorComponent {
    private _contributorId: number;
    private _contributor: Contributor; 

    constructor(protected contributorService: ContributorService, params: RouteParams) {
        this._contributorId = +params.get('id');
        this.loadContributor();
    }
    
    get contributor(): Contributor {
        return this._contributor;
    }

    protected loadContributor(): void {
        this.contributorService.getContributorById(this._contributorId)
            .subscribe( 
                contributor => this._contributor = contributor,
                (error: any) => AppComponent.generalError(error.status)
            );
    }
}