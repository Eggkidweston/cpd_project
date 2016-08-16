import { Injectable, Input, bind } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
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
        this.loadAllTags(false);
        return this._allTags;
    }

    private loadAllTags(resourcedOnly) {
        this._allTags = this.http.get(`${appSettings.apiRoot}tags?limit=100&resourcedonly=`+resourcedOnly.toString())
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