import { Injectable, bind } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StoreApp, TagCloud, SignedUrl } from '../models';
import { appSettings } from './services';
import { AuthenticationService } from './authentication.service';
import { Review, ResourceMetrics, ResourceMetric } from 'models';

@Injectable()
export class AppsService
{
    constructor( private http:Http,
                 private authenticationService:AuthenticationService )
    {
        this.getAllApps();
    }

    public getAllApps()
    {
        return this.http.get( `${appSettings.apiRoot}resources?$top=100` )
            .map( res => <StoreApp[]>res.json().data )
            .catch( this.handleError );
    }

    public getRecentApps()
    {
        return this.http.get( `${appSettings.apiRoot}resources/recent` )
            .map( res => <StoreApp[]>res.json().data )
            .catch( this.handleError );
    }

    public getTagCloud()
    {
        return this.http.get( `${appSettings.apiRoot}tags?limit=100` )
            .map( res => <TagCloud>res.json().data )
            .catch( this.handleError );
    }

    public getByTag( tag )
    {

        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', this.authenticationService.apiKey );

        console.log( this.authenticationService.apiKey );

        return this.http.get( `${appSettings.apiRoot}tags/${tag.name}?limit=100`, { headers } )
            .map( res => <StoreApp[]>res.json().resources )
            .catch( this.handleError );

    }

    public getRecommendedApps()
    {
        return this.http.get( `${appSettings.apiRoot}resources/recommended` )
            .map( res => <StoreApp[]>res.json().data )
            .catch( this.handleError );
    }

    public getAppDetails( appId:number )
    {
        return this.http.get( `${appSettings.apiRoot}resources/${appId}` )
            .map( res => <StoreApp>res.json().resource )
            .catch( this.handleError );
    }

    public getByCreator( createdBy:number )
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );

        //  return this.http.get(`${appSettings.apiRoot}resources?$top=3`)
        return this.http.get( `${appSettings.apiRoot}resources?$filter=createdby%20eq%20'${ createdBy }'`, { headers } )
            .map( res => <StoreApp[]>res.json().data )
            .catch( this.handleError );
    }

    public getReviews( resourceId:number )
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', this.authenticationService.apiKey );

        return this.http.get( `${appSettings.apiRoot}resources/${resourceId}/reviews`, { headers } )
            .map( res => <Review[]>res.json().data )
            .catch( this.handleError );
    }

    public submitReview( review:Review,
                         done:( review ) => void,
                         error:( err ) => void )
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', this.authenticationService.apiKey );

        this.http.post( `${appSettings.apiRoot}reviews/create`,
            JSON.stringify( {
                resource_id: review.resource_id,
                title: review.title,
                description: review.description,
                rating: review.rating
            } ),
            { headers } )
            .map( res => <Review>res.json() )
            .subscribe(
                review => done( review ),
                err => error( err )
            );
    }

    public getApp( appId:number )
    {
        return this.http.get( `${appSettings.apiRoot}resources/${appId}/download` )
            .map( res => res.json().url )
            .catch( this.handleError );
    }

    public getResourceMetrics( resourceId:number, date:string,
                               next:( metrics ) => void,
                               error:( err ) => void )
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', this.authenticationService.apiKey );

        this.http.post( `${appSettings.apiRoot}resources/metrics`,
            JSON.stringify( {
                id: resourceId,
                timestamp: date,
                report: 1
            } ),
            { headers } )
            .map( res => <ResourceMetrics>(res.json() as Array<any>)[0] )
            .subscribe(
                metrics => next( metrics ),
                err => error( err )
            )
    }

    public getResourceCuration( resourceId:number,
                                next:( curation ) => void,
                                error:( err ) => void )
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', this.authenticationService.apiKey );

        this.http.post( `${appSettings.apiRoot}resources/curation`,
            JSON.stringify( {
                id: resourceId
            } ),
            { headers } )
            .map( res => res.json() )
            .subscribe(
                metrics => next( metrics ),
                err => error( err )
            )
    }

    public uploadFileToS3( file:any, next:( filename:string ) => void, error:( err ) => void )
    {
        let xhr = new XMLHttpRequest();

        var now = new Date().getTime();
        var filename = now + "-" + file.file.name;
        var url = `${appSettings.apiRoot}resources/signed_url?fileName=${filename}&fileType=${file.file.type}`;

        xhr.open( "GET", url );
        xhr.setRequestHeader( 'x-access-token', this.authenticationService.apiKey );
        xhr.onreadystatechange = () =>
        {
            if( xhr.readyState === 4 ) {
                if( xhr.status === 200 ) {
                    var response = JSON.parse( xhr.responseText );
                    var s3xhr = new XMLHttpRequest();
                    s3xhr.open( "PUT", response.data.signed_request );
                    s3xhr.setRequestHeader( 'x-amz-acl', 'public-read' );
                    s3xhr.onload = () =>
                    {
                        if( s3xhr.status === 200 ) {
                            next( filename );
                        } else {
                            error( "Could not upload file" );
                        }
                    };
                    s3xhr.onerror = ( err ) => error( err );
                    s3xhr.send( file._file );
                } else {
                    error( "Could not get signed URL" );
                }
            }
        };
        xhr.send();
    }

    private handleError( error:Response )
    {
        return Observable.throw( error );
    }
}

export var appsServiceInjectables:Array<any> = [
    bind( AppsService ).toClass( AppsService )
];