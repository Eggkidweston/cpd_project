import { Injectable, Input, bind } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {StoreApp, TagCloud} from '../models';
import { appSettings } from './services';
import { AuthenticationService } from './authentication.service';
import { Review } from '../models';

@Injectable()
export class AppsService {
    constructor(private http: Http,
        private authenticationService: AuthenticationService) {
        this.getAllApps();
    }

    public getAllApps() {
        return this.http.get(`${appSettings.apiRoot}resources?$top=100`)
            .map(res => <StoreApp[]>res.json().data)
            .catch(this.handleError);
    }

    public getRecentApps() {
        return this.http.get(`${appSettings.apiRoot}resources/recent`)
            .map(res => <StoreApp[]>res.json().data)
            .catch(this.handleError);
    }

    public getTagCloud() {
        return this.http.get(`${appSettings.apiRoot}tags?limit=100`)
            .map(res => <TagCloud>res.json().data)
            .catch(this.handleError);
    }

    public getByTag(tag) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-access-token', this.authenticationService.apiKey);

        console.log(this.authenticationService.apiKey);

        return this.http.get(`${appSettings.apiRoot}tags/${tag.name}?limit=100`, { headers } )
            .map( res => <StoreApp[]>res.json().resources)
            .catch(this.handleError);

    }

    public getRecommendedApps() {
        return this.http.get(`${appSettings.apiRoot}resources/recommended`)
            .map(res => <StoreApp[]>res.json().data)
            .catch(this.handleError);
    }

    public getAppDetails(appId: number) {
        return this.http.get(`${appSettings.apiRoot}resources/${appId}`)
            .map(res => <StoreApp>res.json().resource)
            .catch(this.handleError);
    }
    
    public getByCreator(createdBy: number) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

      //  return this.http.get(`${appSettings.apiRoot}resources?$top=3`)
        return this.http.get(`${appSettings.apiRoot}resources?$filter=createdby%20eq%20'${ createdBy }'`, { headers })
            .map( res => <StoreApp[]>res.json().data )
            .catch(this.handleError);
    }
    
    public getReviews(resourceId: number)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-access-token', this.authenticationService.apiKey);
        
        return this.http.get(`${appSettings.apiRoot}resources/${resourceId}/reviews`, { headers } )
            .map( res => <Review[]>res.json().data)
            .catch(this.handleError);
    }

    public submitReview(review: Review,
        done: (review) => void,
        error: (err) => void) 
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-access-token', this.authenticationService.apiKey);

        this.http.post(`${appSettings.apiRoot}reviews/create`,
            JSON.stringify({ 
                resource_id: review.resource_id,
                title: review.title,
                description: review.description,
                rating: review.rating }), 
                { headers })
            .map(res => <Review>res.json())
            .subscribe(
                review => done(review),
                err => error(err)
            );
    }

    public getApp(appId: number) {
        return this.http.get(`${appSettings.apiRoot}resources/${appId}/download`)
            .map(res => res.json().url)
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var appsServiceInjectables: Array<any> = [
    bind(AppsService).toClass(AppsService)
];