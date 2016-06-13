import { Injectable, bind } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appSettings } from './services';
import { Contributor } from '../models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ContributorService
{
    constructor( private http:Http, private authenticationService:AuthenticationService )
    {
    }

    public getContributorById( contributorId:number ):Observable<any>
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', this.authenticationService.apiKey );

        return this.http.get( `${appSettings.apiRoot}contributors/${contributorId}`, { headers } )
            .map( res => res.json().contributor )
            .catch( this.handleError );
    }

    private handleError( error:Response )
    {
        return Observable.throw( error );
    }
}

export var contributorServiceInjectables:Array<any> = [
    bind( ContributorService ).toClass( ContributorService )
];