import { Injectable, Input, bind } from 'angular2/core';
import { Http } from 'angular2/http';
import { Response } from '../../../node_modules/angular2/src/http/static_response.d.ts';
import { Observable } from 'rxjs/Observable';
import { appSettings } from './services';

@Injectable()
export class TagsService {
    constructor(private http: Http) 
    {
    }

    public getAllTags() {
        // return this.http.get(`${appSettings.apiRoot}tags`)
        //     .map(res => <Array<string>>res.json().data)
        //     .catch(this.handleError);
        return this.http.get(`${appSettings.apiRoot}tags`)
            .map(res => ['Further Education', 'Higher Education', 'Speech Therapy', 'Balloons', 'Cards'])
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var tagsServiceInjectables: Array<any> = [
    bind(TagsService).toClass(TagsService)
];