import { Injectable, bind } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { appSettings } from './services';
import { User } from '../models';

@Injectable()
export class AuthenticationService {
    // move to locale storage
    private static _user: User = null;
    private static API_KEY: string;

    constructor(private http: Http) {
    }

    get user(): User {
        return AuthenticationService._user;
    }

    get userSignedIn(): boolean {
        return AuthenticationService._user != null;
    }
    
    get apiKey(): string {
        return AuthenticationService.API_KEY;
    }

    register(email: string, username:string, password: string,
        next: () => void,
        error: (res: Response) => void,
        complete: () => void)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(`${appSettings.apiRoot}users/register`,
            JSON.stringify({
                name: username,
                username: username,
                email: email,
                password: password
            }), { headers })
            .map(res => res.json())
            .subscribe(
                data => {
                    AuthenticationService._user = data.user;
                    next();
                },
                err => error(err),
                () => complete()
            );
    }

    signIn(emailOrUsername: string, password: string,
        next: () => void,
        error: (res: Response) => void)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(`${appSettings.apiRoot}authenticate`,
            JSON.stringify({
                emailOrUsername: emailOrUsername,
                password: password
            }), { headers })
            .map(res => <any>res.json())
            .subscribe(
                data => {
                    AuthenticationService.API_KEY = <any>data.token;
                    headers.append('x-access-token', AuthenticationService.API_KEY);
                    this.http.get(`${appSettings.apiRoot}users/me`, { headers })
                        .map(res => res.json())
                        .subscribe(data => {
                            AuthenticationService._user = data.user;
                            next();
                        });
                },
                err => error(err)
            );
    }

    signOut() {
        AuthenticationService.API_KEY = null;
        AuthenticationService._user = null;
    }

    isEmailOrUsernameInUse(emailOrUsername: string, 
        exists: (exists: boolean) => void, 
        err: (res: Response) => void,
        complete: () => void) 
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(`${appSettings.apiRoot}users/availability`,
            JSON.stringify({
                emailOrUsername: emailOrUsername
            }), { headers })
            .map(res => res.json())
            .subscribe(
                (res) => exists(false),
                (res) => {
                    if( res.status === 409 ) exists(true);
                    else err(res);
                }
            );
    }

    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var authenticationServiceInjectables: Array<any> = [
    bind(AuthenticationService).toClass(AuthenticationService)
];