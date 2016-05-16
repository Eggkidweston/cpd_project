import { Component } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { AppsService } from "../../../services/apps.service";
import { StoreApp } from "../../../models";
import { AppComponent } from '../../../app.component';

@Component( {
    selector: 'revision-history',
    template: require( 'revision-history.component.html' ),
    styles: [require( './revision-history.component.scss' ).toString()]
} )
export class RevisionHistoryComponent {
    protected resourceId:number;
    protected resource:StoreApp;
    protected curation;

    constructor( protected appsService:AppsService, params:RouteParams ) {
        this.resourceId = +params.get( 'id' );
        this.loadResource();
        this.loadCuration();
    }

    protected loadResource() {
        this.appsService.getAppDetails( this.resourceId )
            .subscribe(
                resource => this.resource = resource,
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    protected loadCuration() {
        this.appsService.getResourceCuration( this.resourceId,
            ( curation ) => {
                this.curation = curation;
                console.log(`curation: ${JSON.stringify(curation)}`);
            },
            ( error:any ) => AppComponent.generalError( error.status )
        );
    }
}