import { Component } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { ContributorService } from '../../services/services';
import { AppComponent } from '../../app.component';
import { Contributor, Activity } from '../../models';

@Component({
    selector: 'contributor',
    template: require('./contributor.component.html'),
    styles: [require('./contributor.component.scss').toString()],
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
        this._contributor = new Contributor();
        this._contributor.imageUrl = "http://starschanges.com/wp-content/uploads/2015/05/Tom-Hardy-Pictures-1.jpg";
        this._contributor.name = "Tom Hardy";
        this._contributor.username = "Tom Hardy";
        this._contributor.registeredDate = "01/01/2016";
        this._contributor.reputation = 122;
        this._contributor.activity = new Array<Activity>();
        this._contributor.activity.push({ type: "New content", comment: "Uploaded new content - Technical Writing", date: "12/02/2016" });
        this._contributor.activity.push({ type: "Comment", comment: "I have some new content coming that you can remix", date: "12/02/2016" });
        this._contributor.content = new Array<number>();
        this._contributor.content.push(1);
        this._contributor.content.push(2);
        this._contributor.content.push(3);
        
        return;
        // this.contributorService.getContributorById(this._contributorId)
        //     .subscribe( 
        //         contributor => this._contributor = contributor,
        //         (error: any) => AppComponent.generalError(error.status)
        //     );
    }
}