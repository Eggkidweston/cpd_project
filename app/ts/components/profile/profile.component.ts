import { Component } from '@angular/core';
import { ContributorComponent } from '../../components/store-front/contributor/contributor.component';
import { DownloadHistoryComponent } from '../store-front/download-history/download-history.component';

@Component( {
    selector: 'profile',
    template: require( './profile.component.html' ),
    directives: [ContributorComponent, DownloadHistoryComponent]
} )
export class ProfileComponent
{
    constructor()
    {
    }

}
