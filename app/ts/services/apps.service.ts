import { Injectable, bind } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StoreApp, TagCloud, SignedUrl, Resource, GetResourceResults, GetSearchResults, ResourceInstructions } from '../models';
import { appInfo } from './services';
import { appSettings } from '../../../settings';
import { AuthenticationService } from './authentication.service';
import { Review, ResourceMetrics, ResourceMetric, DownloadInstructions } from '../models';

let _ = require( 'underscore' );

@Injectable()
export class AppsService
{
    constructor( private http:Http,
                 private authenticationService:AuthenticationService )
    {
    }

    public getResources(appsPerPage: number, pageNumber: number, filterText :string)
    {
        return this.http.get( `${appSettings.apiRoot}resources/explore?$skip=${appsPerPage*(pageNumber-1)}&$top=${appsPerPage}&$filter=${filterText}` ) // &$filter=contains('title', 'Introduction')
            .map( res => <GetResourceResults>res.json() )
            .catch( this.handleError );
    }

    public getResourceCount(activeOnly: boolean)
    {
        let searchQuery = `${appSettings.apiRoot}resources/count?`;
        if(activeOnly) searchQuery += "$filter=(active eq true)";

        return this.http.get(searchQuery)
            .map( res => <GetSearchResults>res.json() )
            .catch( this.handleError );
    }

    public getMostDownloadedApps(appsPerPage: number, pageNumber: number)
    {
        return this.http.get( `${appSettings.apiRoot}resources/mostdownloaded?$top=`+appsPerPage )
            .map( res => <GetResourceResults[]>res.json() )
            .catch( this.handleError );
    }

    public getRecentApps(appsPerPage: number, pageNumber: number)
    {
        return this.http.get( `${appSettings.apiRoot}resources/recent?$top=`+appsPerPage )
            .map( res => <GetResourceResults[]>res.json() )
            .catch( this.handleError );
    }
    
    /*public getLastUpdatedApps(appsPerPage: number, pageNumber: number)
    {
        return this.http.get( `${appSettings.apiRoot}resources?$orderby=updatedat%20desc&$top=`+appsPerPage+`&$filter=active%20eq%20true` )
            .map( res => <GetResourceResults[]>res.json() )
            .catch( this.handleError );
    }*/

    public getRecommendedApps(appsPerPage: number, pageNumber: number)
    {
        return this.http.get( `${appSettings.apiRoot}resources/recommended?$top=`+appsPerPage )
            .map( res => <GetResourceResults[]>res.json() )
            .catch( this.handleError );
    }

    public getTagCloud(resourcedOnly, limit, order)
    {
        limit = limit || 200;
        return this.http.get( `${appSettings.apiRoot}tags?limit=`+limit+`&resourcedonly=`+resourcedOnly.toString()+'&order='+order )
            .map( res => <TagCloud>res.json().data )
            .catch( this.handleError );
    }

    public getTags(tagIds)
    {
        return this.http.get( `${appSettings.apiRoot}tags?limit=200&ids=`+tagIds )
            .map( res => <TagCloud>res.json().data )
            .catch( this.handleError );
    }

    public getRelatedTags(tagIds)
    {
        return this.http.get( `${appSettings.apiRoot}tags/relations/`+tagIds )
            .map( res => <TagCloud>res.json().data )
            .catch( this.handleError );
    }

    public getByTag( tag )
    {

        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', AuthenticationService.apiKey );

        return this.http.get( `${appSettings.apiRoot}tags/${tag}?limit=100`, { headers } )
            .map( res => <StoreApp[]>res.json().resources )
            .catch( this.handleError );

    }

    public getBySearch( searchTerm, opened, activeOnly: boolean)
    {
        let searchQuery = `${appSettings.apiRoot}resources/search?$top=100&$skip=0&term=${ searchTerm }`;
        if(activeOnly) searchQuery += "&active=true";
        return this.http.get(searchQuery)
            .map( res => <GetSearchResults>res.json() )
            .catch( this.handleError );
    }

    public getBySearchPaged( searchTerm, openEd, appsPerPage: number, pageNumber: number, activeOnly: boolean)
    {
        let searchQuery = `${appSettings.apiRoot}resources/search?$skip=${appsPerPage*(pageNumber-1)}&$top=${appsPerPage}&term=${ searchTerm }`;
        if(activeOnly) searchQuery += "&active=true";

        return this.http.get(searchQuery)
            .map( res => <GetSearchResults>res.json() )
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

        return this.http.get( `${appSettings.apiRoot}resources?$filter=createdby%20eq%20'${ createdBy }'%20and%20active%20eq%20true`, { headers } )
            .map( res => <StoreApp[]>res.json().data )
            .catch( this.handleError );
    }

    public getReviews( resourceId:number )
    {
        let headers = new Headers();
        headers.append( 'Content-Type', 'application/json' );
        headers.append( 'x-access-token', AuthenticationService.apiKey );

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
        headers.append( 'x-access-token', AuthenticationService.apiKey );

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
        headers.append( 'x-access-token', AuthenticationService.apiKey );

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

    public getResourceCuration( resourceId:number )
    {
        let c = JSON.parse( `
{
    "revisions": [
        {
            "contributorId": "1",
            "contributorImageUrl": "http://a5.files.biography.com/image/upload/c_fill,cs_srgb,dpr_1.0,g_face,h_300,q_80,w_300/MTE5NTU2MzE2NjUyOTk2MTA3.jpg",
            "comment": "Fixed issue #12: Broken links in wiring section",
            "status": "2",
            "date": "2016-02-10T07:24:31.613Z"
        },
        {
            "contributorId": "2",
            "contributorImageUrl": "http://a1.files.biography.com/image/upload/c_fit,cs_srgb,dpr_1.0,h_1200,q_80,w_1200/MTE4MDAzNDEwNzQzMTY2NDc4.jpg",
            "comment": "Added accessibility information",
            "status": "1",
            "date": "2016-05-10T07:24:31.613Z"
        },
        {
            "contributorId": "3",
            "contributorImageUrl": "http://www.cbc.ca/strombo/content/images/Richard-Dawkins-220x220.jpg",
            "comment": "Initial submission",
            "status": "0",
            "date": "2016-01-10T07:24:31.613Z"
        }
    ]
}                
        ` );

        return Observable.of( c )

        // let headers = new Headers();
        // headers.append( 'Content-Type', 'application/json' );
        // headers.append( 'x-access-token', this.authenticationService.apiKey );
        //
        // this.http.post( `${appSettings.apiRoot}resources/curation`,
        //     JSON.stringify( {
        //         id: resourceId
        //     } ),
        //     { headers } )
        //     .map( res => res.json() )
        //     .subscribe(
        //         metrics => next( metrics ),
        //         err => error( err )
        //     )
    }

    // necessary to use node-style callback because we're using RxJS's Observable.bindNodeCallback()
    public uploadFileToS3( file:any, apiKey:string, next:( err:any, filename:string ) => void )
    {
        let xhr = new XMLHttpRequest();

        var now = new Date().getTime();
        var filename = now + "-" + file.file.name;
        var url = `${appSettings.apiRoot}resources/signed_url?fileName=${filename}&fileType=${file.file.type}`;

        xhr.open( "GET", url );
        xhr.setRequestHeader( 'x-access-token', apiKey );
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
                            next( null, `${appSettings.s3Root}${filename}` );
                        } else {
                            next( "Could not upload file", null );
                        }
                    };
                    s3xhr.onerror = ( err ) => next( err, null );
                    s3xhr.send( file._file );
                } else {
                    next( "Could not get signed URL", null );
                }
            }
        };
        xhr.send();
    }

    public submitResource( newResource:Resource )
    {
        return Observable.create( observer =>
        {
            let xhr:XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () =>
            {
                if( xhr.readyState === 4 ) {
                    if( xhr.status === 200 ) {
                        observer.next( <StoreApp>JSON.parse( xhr.responseText ).resource );
                        observer.complete();
                    } else {
                        Observable.throw( "Cannot upload resource" );
                    }
                }
            };

            let formData = new FormData();
            xhr.open( 'POST', `${appSettings.apiRoot}resources/create`, true );
            xhr.setRequestHeader( 'x-access-token', AuthenticationService.apiKey );
            _.mapObject( _.omit( newResource, ( value, key, object ) => _.isArray( value ) ),
                ( value, key ) => formData.append( key, value ) );
            _.mapObject( _.pick( newResource, ( value, key, object ) => _.isArray( value ) ),
                ( array, key ) => { for( var item in array ) formData.append( `${key}[${item}]`, array[item] ); }
            );
            xhr.send( formData );
        } );
    }

    private handleError( error:Response )
    {
        return Observable.throw( error );
    }
}

export var appsServiceInjectables:Array<any> = [
    bind( AppsService ).toClass( AppsService )
];