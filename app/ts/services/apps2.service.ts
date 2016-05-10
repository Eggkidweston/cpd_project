import { Injectable, bind } from '@angular/core';
import {Http, Response} from '@angular/http';
import {ShadowApp}           from '../models';
import {Observable}     from 'rxjs/Observable';
import {Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/do';

@Injectable()
export class Apps2Service {
    constructor (private http: Http) {}

    private _shadowAppURL = 'http://dash.analytics.alpha.jisc.ac.uk:1342/resources';  // URL to web api

    getApp (id) {


        let token = '123';
        let headers = new Headers({ 'Content-Type': 'application/json','Authorization':token });
        let options = new RequestOptions({ headers: headers });


        var url =this._shadowAppURL + '?storeID='+id

        console.log (url);

        return this.http.get(url, options)
            .map(res => <ShadowApp[]> res.json())
            .do(res => console.log("Results is " + JSON.stringify(res)))
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        return Observable.throw(error);
    }

}

export var apps2ServiceInjectables: Array<any> = [
    bind(Apps2Service).toClass(Apps2Service)
];