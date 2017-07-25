import { Injectable, bind } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

// RxJS might be overkill for this...
@Injectable()
export class SigninRegisterService {
    public lastRoute: string;

    constructor(public router: Router) {

        if (typeof(Storage) !== 'undefined') {
            this.lastRoute = localStorage.getItem('last-route');
        }
    };

    resumeAfterSigninOrRegister() {
        if( this.lastRoute ) {
            this.router.navigateByUrl('' + this.lastRoute);
        } else {
            this.router.navigate(['Home']);
        }
    }

    goIDP() {
        this.router.navigate(['RegisterIDP']);
    }

    redirectToProfileAfterSignin() {
        this.lastRoute = 'profile';
    }
}

export var signinRegisterServiceInjectables: Array<any> = [
    bind(SigninRegisterService).toClass(SigninRegisterService)
];
