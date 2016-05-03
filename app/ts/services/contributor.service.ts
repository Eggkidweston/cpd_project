import { Injectable, bind } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { appSettings } from './services';
import { Contributor } from '../models';

@Injectable()
export class ContributorService {
    constructor(private http: Http) {
    }

    public getContributorById( contributorId: number ): Observable<Contributor> {
        return this.http.get(`${appSettings.apiRoot}contributor/${contributorId}`)
            .map(res => <Contributor>res.json().contributor)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var contributorServiceInjectables: Array<any> = [
    bind(ContributorService).toClass(ContributorService)
];