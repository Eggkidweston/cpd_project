import { Injectable, bind } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appSettings } from './services';
import { Contributor } from '../models';

@Injectable()
export class ContributorService {
    constructor(private http: Http) {
    }

    public getContributorById( contributorId: number ): Observable<Contributor> {
        let c: Contributor = new Contributor();
        c = JSON.parse(`
        {
            "imageUrl":"http://starschanges.com/wp-content/uploads/2015/05/Tom-Hardy-Pictures-1.jpg",
            "name":"Tom Hardy",
            "username":"Tom Hardy",
            "registeredDate":"01/01/2016",
            "reputation":122,
            "activity":[
                {
                    "type":"New content",
                    "comment":"Uploaded new content - Technical Writing",
                    "date":"2016-01-10T07:24:31.613Z"
                },
                {
                    "type":"Comment",
                    "comment":"I have some new content coming that you can remix",
                    "date":"2016-05-04T19:24:31.613Z"
                }
            ],
            "content": [
                {
                    "id": 11,
                    "title": "Employment for the 21st Century",
                    "image": "http://static1.squarespace.com/static/5498a97ae4b0f6433a34aecb/55078110e4b038dc7dbdc55e/55078110e4b038dc7dbdc560/1426133108195/Employment+Icon.png",
                    "average_rating": null
                },
                {
                    "id": 12,
                    "title": "Jisc Learning Analytics Student App",
                    "image": "http://media.data.alpha.jisc.ac.uk/media/la-app-icon.png",
                    "average_rating": null
                }
            ]
        }
        `);

        return Observable.of(c);
                
        // return this.http.get(`${appSettings.apiRoot}contributor/${contributorId}`)
        //     .map(res => <Contributor>res.json().contributor)
        //     .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var contributorServiceInjectables: Array<any> = [
    bind(ContributorService).toClass(ContributorService)
];