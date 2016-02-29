import { Injectable, bind } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { StoreApp } from '../models';
import { appSettings } from './services';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AppsService {
    constructor(private http: Http, 
    private authenticationService: AuthenticationService) {}
    
    public getRecentApps() {
        return this.http.get(`${appSettings.apiRoot}resources/recent`)
            .map(res => <Array<StoreApp>> res.json().data)
            .catch(this.handleError);
    }

    public getRecommendedApps() {
        return this.http.get(`${appSettings.apiRoot}resources/recommended`)
            .map(res => <Array<StoreApp>> res.json().data)
            .catch(this.handleError);
    }
    
    public submitReview(title: string, reviewText: string,
        done:(review) => void,
        error:(err) => void) 
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-access-token', this.authenticationService.apiKey);
        
        this.http.post(`${appSettings.apiRoot}reviews/create`,
            JSON.stringify({
                resource_id: 0,
                title: title,
                description: reviewText,
                rating: 0
            }), { headers })
            .map(res => res.json())
            .subscribe( 
                review => done(review),
                err => error(err)
            );
    }
        
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var appsServiceInjectables: Array<any> = [
    bind(AppsService).toClass(AppsService)
];