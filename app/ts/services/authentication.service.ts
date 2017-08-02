import { Injectable, bind } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appSettings } from '../../../settings';
import { User } from '../models';
import { Router } from '@angular/router-deprecated';
import { HelperService } from "./helper.service";
import * as moment from 'moment';

@Injectable()
export class AuthenticationService {
    private static _user: User = null;
    private static _apiKey: string;
    private static _router: Router;
    private static _http: Http;

    constructor(private http: Http, public router: Router) {
        AuthenticationService._router = router;
        AuthenticationService._http = http;
    }

    static get user(): User {
        if (typeof(Storage) !== "undefined") {
            return <User>(JSON.parse(localStorage.getItem("_user")));
        } else {
            return AuthenticationService._user;
        }
    }

    static set user(user: User) {
        if (typeof(Storage) !== "undefined" && user !== null) {
            localStorage.setItem('_user', JSON.stringify(user));
        }

        AuthenticationService._user = user;
    }

    userSignedIn(): boolean {
        var result = AuthenticationService.user != null;
        return result;
    }

    userIsAdmin(): boolean {
        var result = false;
        if(this.userSignedIn()){
          result = AuthenticationService.user.isadmin;
        }

        return result;
    }

    static refreshToken(apiKey) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return AuthenticationService._http.post(`${appSettings.apiRoot}authenticate/refreshtoken`,
            JSON.stringify({
                token: apiKey
            }), { headers })
            .map(res => <any>res.json())
            .catch(AuthenticationService.handleError)
    }

    static handleError( error:Response )
    {
        return Observable.throw( error );
    }

    static get apiKey(): string {

        if (typeof(Storage) !== 'undefined') {
            let tokenExpiry = localStorage.getItem('_tokenExpiry');
            let tokenExpiryTime = moment.unix(parseInt(tokenExpiry));
            let currentTime = moment(new Date());
            let duration = moment.duration(tokenExpiryTime.diff(currentTime)).asMinutes();
            let apiKey = localStorage.getItem('_apiKey');

            if (duration > 0 && duration < 15) {

                var refreshingToken = localStorage.getItem('_refreshingToken');

                if (refreshingToken === "true") {
                    //No need to refresh token
                    return apiKey;
                }

                localStorage.setItem('_refreshingToken', 'true');

                // Asynchronously refresh  the JWT
                AuthenticationService.refreshToken(apiKey).subscribe(
                    data => {
                        AuthenticationService.apiKey = <any>data.token;
                        AuthenticationService.storeTokenExpiryTime(data.token);
                        localStorage.setItem('_refreshingToken', 'false');

                        return apiKey;
                    },
                    (error: any) => {
                        AuthenticationService.signOut();
                        AuthenticationService._router.navigate( ['SignIn', { signedout: true}] );

                        localStorage.setItem('_refreshingToken', 'false');

                        return null;
                    }
                );

                //Return the current api key whilst its being refreshed in the background
                return apiKey;

            } else if (duration < 0) {
                // JWT Expired - sign out
                this.signOut();
                AuthenticationService._router.navigate( ['SignIn', { signedout: true}] );
            } else {
                return apiKey;
            }
        } else {
            return AuthenticationService._apiKey;
        }
    }

    static set apiKey(apiKey:string) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("_apiKey", apiKey);
        }

        AuthenticationService._apiKey = apiKey;
    }

    registerWithLocalPid( username:string,
        next: () => void,
        error: (res: Response) => void,
        complete: () => void)
    {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let localpid:string = localStorage.getItem("pid");

        var json = JSON.stringify({
                name: username,
                username: username,
                email: localpid
            });

        this.http.post(`${appSettings.apiRoot}users/registeridp`,
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
        error: (res: Response) => void)
    {
        let localpid:string = localStorage.getItem("pid");
        this.signIn(localpid, next, error);
    }

    signInWithToken(token:string, next: () => void, error: (res: Response) => void)
    {
        AuthenticationService.apiKey = <any>token;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('x-access-token', token);
        this.http.get(`${appSettings.apiRoot}users/me`, { headers })
            .map(res => res.json())
            .subscribe(data => {
                AuthenticationService.user = data.user;
                next();
            },
            err => error(err)
        );
    }

    signIn(email: string,
        next: () => void,
        error: (res: Response) => void)
    {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(`${appSettings.apiRoot}authenticate/idp`,
            JSON.stringify({
                email: email
            }), { headers })
            .map(res => <any>res.json())
            .subscribe(
                data => {
                    AuthenticationService.apiKey = <any>data.token;
                    AuthenticationService.storeTokenExpiryTime(data.token);
                    headers.append('x-access-token', data.token);
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

    signInAdmin(password: string,
        next: () => void,
        error: (res: Response) => void)
    {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let localpid:string = localStorage.getItem("pid");

        this.http.post(`${appSettings.apiRoot}authenticate/idpadmin`,
            JSON.stringify({
                email: localpid,
                password: password,
            }), { headers })
            .map(res => <any>res.json())
            .subscribe(
                data => {
                    AuthenticationService.apiKey = <any>data.token;
                    AuthenticationService.storeTokenExpiryTime(data.token);
                    headers.append('x-access-token', data.token);
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
        localStorage.removeItem("pid");
        localStorage.removeItem("_user");
        localStorage.removeItem('_tokenExpiry');
        localStorage.removeItem('_refreshingToken');
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

    static storeTokenExpiryTime(apiKey: string){
        let expiryDate = this.extractExpiryDateFromApiKey(apiKey);
        localStorage.setItem('_tokenExpiry', expiryDate);
    }

    private static extractExpiryDateFromApiKey(apiKey: string) {
        var jwtArray = apiKey.split('.');
        var base64DecodedString = HelperService.base64DecodeString(jwtArray[1]);
        var payload = JSON.parse(base64DecodedString);

        return payload.exp;
    }

    private handleError(error: Response) {
        return Observable.throw(error);
    }
}

export var authenticationServiceInjectables: Array<any> = [
    bind(AuthenticationService).toClass(AuthenticationService)
];
