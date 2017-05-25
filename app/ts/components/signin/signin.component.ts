import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService, SigninRegisterService } from '../../services/services';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'signin',
    directives: [RouterOutlet, RouterLink],
    styles: [require('./signin.scss').toString()],
    template: require('./signin.component.html'),
})
export class SignInComponent {
    busy: boolean = false;
    shaking: boolean = false;
    forgotPassword: boolean = false;
    forgotPasswordEmailSent: boolean = false;
    forgotErrorDisplayed: boolean = false;

    signInForm: ControlGroup;
    emailOrUsername: AbstractControl;
    password: AbstractControl;

    resetPasswordForm: ControlGroup;
    resetEmail: AbstractControl;

    constructor(
        public authenticationService: AuthenticationService,
        public signinRegisterService: SigninRegisterService,
        private router: Router,
        fb: FormBuilder )
    {
        this.signInForm = fb.group({
            "emailOrUsername": ["", Validators.required],
            "password": ["", Validators.required]
        });

        this.emailOrUsername = this.signInForm.controls['emailOrUsername'];
        this.password = this.signInForm.controls['password'];

        this.resetPasswordForm = fb.group({
            "resetEmail": ["", Validators.required]
        });

        this.resetEmail = this.resetPasswordForm.controls['resetEmail'];
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

    onSubmitPasswordReset(formValues: any) {
        this.forgotErrorDisplayed = false;
        this.forgotPasswordEmailSent = false;

        if (this.resetPasswordForm.valid) {
            this.busy = true;
            this.forgotErrorDisplayed = false;
            this.forgotPasswordEmailSent = false;

            this.authenticationService.forgotPassword(formValues.resetEmail,
                () => {
                    this.forgotPasswordEmailSent = true;
                    this.busy = false;
                },
                (res: any) => {
                    this.shakeForm();
                    this.forgotErrorDisplayed = true;
                    this.busy = false;
                }
            );
        } else {
            this.shakeForm();
        }
    }

    goIDP(){
        
    }

    shakeForm() {
        // darn CSS3 animations
        this.shaking = true;
        setTimeout(() => {
            this.shaking = false;
        }, 500);
    }
}
