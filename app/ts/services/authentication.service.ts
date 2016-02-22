import { Injectable, bind } from 'angular2/core';
import { Http } from 'angular2/http';
import { Response } from '../../../node_modules/angular2/src/http/static_response.d.ts';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { appSettings } from './services';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) {
    }
    
    register(email: string, username:string, password: string,
        next: (res: Response) => void, 
        error: (res: Response) => void,
        complete: () => void) 
    {
        this.http.post(`${appSettings.apiRoot}users/register`,
            JSON.stringify({
                email: email,
                password: password
            }))
            .subscribe((res: Response) => {
                next(res);
            }, 
            (err) => {
                error(err);           
            }),
            () => {
                complete();
            };
    }
    
    isEmailInUse(email: string): Observable<Response> {
        return this.http.request(`/api/isemailinuse/${email}`);
    }

    isUsernameInUse(username: string): Observable<Response> {
        return this.http.request(`/api/isusernameinuse/${username}`);
    }
    
    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var authenticationServiceInjectables: Array<any> = [
    bind(AuthenticationService).toClass(AuthenticationService)
];