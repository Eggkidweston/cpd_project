import { Injectable, Input, bind } from 'angular2/core';
import { Http } from 'angular2/http';
import { Response } from '../../../node_modules/angular2/src/http/static_response.d.ts';
import { Observable } from 'rxjs/Observable';
import { appSettings } from './services';
import { Tag } from '../models';

@Injectable()
export class TagsService {
    private _allTags: Observable<Tag[]>;
    
    constructor(private http: Http) {
    }

    get allTags(): Observable<Tag[]> {
        // it would be nice to use something like socket.io to
        // keep these current, but that's a consideration for later
        this.loadAllTags();
        return this._allTags;
    }

    private loadAllTags() {
        this._allTags = this.http.get(`${appSettings.apiRoot}tags`)
            .map(res => <Observable<Tag[]>>res.json().data)
            .catch(this.handleError);
        }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var tagsServiceInjectables: Array<any> = [
    bind(TagsService).toClass(TagsService)
];