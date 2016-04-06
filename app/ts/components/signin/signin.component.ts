import { Component, AfterViewInit, ViewChild } from 'angular2/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from 'angular2/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { AuthenticationService, SigninRegisterService } from '../../services/services';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'signin',
    directives: [RouterOutlet, RouterLink],
    styles: [require('../../../sass/signin.scss').toString()],
    template: require('./signin.component.html'),
})
export class SignInComponent {
    busy: boolean = false;
    shaking: boolean = false;

    signInForm: ControlGroup;
    emailOrUsername: AbstractControl;
    password: AbstractControl;
    
    constructor(
        public authenticationService: AuthenticationService, 
        public signinRegisterService: SigninRegisterService,
        private router: Router, 
        fb: FormBuilder ) 
    {
        this.signInForm = fb.group({
            "emailOrUsername": ["", Validators.required],
            "password": ["", Validators.required]
        }
        );

        this.emailOrUsername = this.signInForm.controls['emailOrUsername'];
        this.password = this.signInForm.controls['password'];
    }

    onSubmit(formValues: any) {
        if (this.signInForm.valid) {
            this.busy = true;

            this.authenticationService
                .signIn(formValues.emailOrUsername, formValues.password,
                () => {
                    this.busy = false;
                    this.signinRegisterService.resumeAfterSigninOrRegister();
                },
                (res: any) => {
                    if (res.status === 403 || res.status === 400) {
                        this.busy = false;
                        this.shakeForm();
                    } else {
                        AppComponent.generalError(res.status);
                    }
                }
                );
        } else {
            this.shakeForm();
        }
    }

    shakeForm() {
        // darn CSS3 animations
        this.shaking = true;
        setTimeout(() => {
            this.shaking = false;
        }, 500);
    }
}
