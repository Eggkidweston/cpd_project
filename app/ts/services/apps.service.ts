import { Injectable, bind } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { StoreApp } from '../models';
import { appSettings } from './services';

@Injectable()
export class AppsService {
    constructor(private http: Http) {}
    
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
        
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var appsServiceInjectables: Array<any> = [
    bind(AppsService).toClass(AppsService)
];