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
                    "type_id": 0,
                    "licensetype_id": 0,
                    "title": "Employment for the 21st Century",
                    "description": "This course aims to teach you the basics about setting up and running an online video conference, or webinar. Webinars are widely used in education and business. Having the skills needed to set up and run a webinar professionally is a new employability skill which can add value to your CV or personal statement.",
                    "url": null,
                    "image": "http://static1.squarespace.com/static/5498a97ae4b0f6433a34aecb/55078110e4b038dc7dbdc55e/55078110e4b038dc7dbdc560/1426133108195/Employment+Icon.png",
                    "active": null,
                    "isfree": null,
                    "downloadcount": 0,
                    "createdby": 16,
                    "overview": null,
                    "recommended": null,
                    "metrics": null,
                    "createdat": "2016-04-09T07:24:31.613Z",
                    "updatedat": "2016-04-09T07:42:49.453Z",
                    "average_rating": null,
                    "creator": {
                        "id": 16,
                        "name": "michael.webb@jisc.ac.uk",
                        "username": "michael.webb@jisc.ac.uk",
                        "email": "michael.webb@jisc.ac.uk",
                        "active": true,
                        "createdat": "2016-04-04T14:33:57.829Z",
                        "updatedat": "2016-04-04T14:33:57.829Z"
                    }
                },
                {
                    "id": 12,
                    "type_id": 0,
                    "licensetype_id": null,
                    "title": "Jisc Learning Analytics Student App",
                    "description": "A fitness app for learning! The Jisc Learning Analytics App is for students who's institutions have signed up for the Jisc Learning Analytics service. Set goals, record you activity,and view details of your activity from places such as you VLE. Compare your activity to that of your friends and average activity for high achievers.",
                    "url": null,
                    "image": "http://media.data.alpha.jisc.ac.uk/media/la-app-icon.png",
                    "active": null,
                    "isfree": null,
                    "downloadcount": 0,
                    "createdby": 16,
                    "overview": "Fitness for Learning",
                    "recommended": null,
                    "metrics": null,
                    "createdat": "2016-04-09T08:08:43.482Z",
                    "updatedat": "2016-04-10T15:06:59.210Z",
                    "average_rating": null,
                    "creator": {
                        "id": 16,
                        "name": "michael.webb@jisc.ac.uk",
                        "username": "michael.webb@jisc.ac.uk",
                        "email": "michael.webb@jisc.ac.uk",
                        "active": true,
                        "createdat": "2016-04-04T14:33:57.829Z",
                        "updatedat": "2016-04-04T14:33:57.829Z"
                    }
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