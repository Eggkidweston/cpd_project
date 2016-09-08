import { Injectable, bind } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

// RxJS might be overkill for this...
@Injectable()
export class SigninRegisterService {
    public lastRoute: string;

    constructor(public router: Router) {
        router.subscribe((value: any) => {
            if( value !== 'signin' && value !== 'register' && value !== 'registeridp' ) {
                this.lastRoute = value;
            }
        })
    };
    
    resumeAfterSigninOrRegister() {
        console.log('resumeAfterRegister');
        if( this.lastRoute ) {
            this.router.navigateByUrl('' + this.lastRoute);
            console.log('navigate to ' + this.lastRoute);
        } else {
            this.router.navigate(['Home']);
            console.log('home');
        }
    }

    goIDP() {
        this.router.navigate(['RegisterIDP']);
    }

    redirectToProfileAfterSignin() {
        this.lastRoute = 'profile'; 
    }

    redirectToProfile() {
        this.router.navigate(['Profile']);
    }
}

export var signinRegisterServiceInjectables: Array<any> = [
    bind(SigninRegisterService).toClass(SigninRegisterService)
];