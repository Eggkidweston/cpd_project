import { Injectable, Input, bind } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { StoreApp } from '../models';
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
        return this.http.get(`${appSettings.apiRoot}resources`)
            .map(res => <StoreApp[]>res.json().data)
            .catch(this.handleError);
    }

    public getRecentApps() {
        return this.http.get(`${appSettings.apiRoot}resources/recent`)
            .map(res => <StoreApp[]>res.json().data)
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
    
    public getReviews(resourceId: number)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-access-token', this.authenticationService.apiKey);
        
        return this.http.get(`${appSettings.apiRoot}resources/${resourceId}/reviews`, { headers} )
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