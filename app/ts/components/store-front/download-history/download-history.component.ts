import { Component } from '@angular/core';
import { ContributorService } from '../../../services/services';
import { Resource } from '../../../models';
import { AppComponent } from '../../../app.component';
import { AppWidgetComponent } from '../../appwidget/appwidget.component';

@Component({
    selector: 'download-history',
    template: require('./download-history.component.html'),
    directives: [AppWidgetComponent]
})

export class DownloadHistoryComponent {

    private _resourceDownloads:Array<Resource>;

    constructor(protected contributorService:ContributorService) {
        this.loadResourceDownloads();
    }

    get resourceDownloads():Array<Resource>
    {
        return this._resourceDownloads;
    }

    protected loadResourceDownloads():void {

        //TODO: shouldn't be contributor service...

        this.contributorService.getResourceDownloads()
            .subscribe(
                resourceDownloads =>
                {
                    this._resourceDownloads = resourceDownloads;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

}