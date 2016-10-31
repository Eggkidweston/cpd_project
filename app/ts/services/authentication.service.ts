import { Injectable, bind } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appSettings } from './services';
import { User } from '../models';

@Injectable()
export class AuthenticationService {
    private static _user: User = null;
    private static _apiKey: string;
    private static _pidpass: string = 'idp628345093456';

    constructor(private http: Http) {
    }

    static get user(): User {
        if (typeof(Storage) !== "undefined") {
            return <User>(JSON.parse(sessionStorage.getItem("_user")));
        } else {
            return AuthenticationService._user;
        }
    }

    static set user(user:User) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem("_user", JSON.stringify(user));
        }

        AuthenticationService._user = user;
    }

    userSignedIn(): boolean {
        var result = AuthenticationService.user != null;
        return result;
    }

    static get apiKey(): string {
        if (typeof(Storage) !== "undefined") {
            return sessionStorage.getItem("_apiKey");
        } else {
            return AuthenticationService._apiKey;
        }
    }

    static set apiKey(apiKey:string) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem("_apiKey", apiKey);
        }

        AuthenticationService._apiKey = apiKey;
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
                    AuthenticationService.user = data.user;
                    next();
                },
                err => error(err),
                () => complete()
            );
    }

    registerWithLocalPid( username:string,
        next: () => void,
        error: (res: Response) => void,
        complete: () => void)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let localpid:string = sessionStorage.getItem("pid");
      
        var json = JSON.stringify({
                name: username,
                username: username,
                email: localpid ,
                password: AuthenticationService._pidpass
            })
           
        this.http.post(`${appSettings.apiRoot}users/register`,
            json, { headers })
            .map(res => res.json())
            .subscribe(
                data => {
                    AuthenticationService.user = data.user;
                    next();
                },
                err => error(err),
                () => complete()
            );
    }

    signInWithPid(
        next: ()=> void,
        error: (res: Response) => void,
        complete: () => void)
    {
        let localpid:string = sessionStorage.getItem("pid");
        this.signIn(localpid, AuthenticationService._pidpass, next, error);
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
                    AuthenticationService.apiKey = <any>data.token;
                    headers.append('x-access-token', AuthenticationService.apiKey);
                    this.http.get(`${appSettings.apiRoot}users/me`, { headers })
                        .map(res => res.json())
                        .subscribe(data => {
                            AuthenticationService.user = data.user;
                            next();
                        });
                },
                err => error(err)
            );
    }

    static signOut() {
        AuthenticationService.apiKey = null;
        AuthenticationService.user = null;
        sessionStorage.setItem("pid",'');
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