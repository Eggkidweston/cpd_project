import { Injectable, bind } from 'angular2/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

// RxJS might be overkill for this...
@Injectable()
export class SigninRegisterService {
    public lastRoute: string;

    constructor(public router: Router) {
        router.subscribe((value: any) => {
            if( value !== 'signin' && value !== 'register' ) 
                this.lastRoute = value;
        })
    };
    
    resumeAfterSigninOrRegister() {
        if( this.lastRoute ) {
            this.router.navigateByUrl(this.lastRoute);
        } else {
            this.router.navigate(['Home']);
        }
    }
}

export var signinRegisterServiceInjectables: Array<any> = [
    bind(SigninRegisterService).toClass(SigninRegisterService)
];