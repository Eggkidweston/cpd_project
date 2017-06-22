import { Component, ViewChild } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RouterOutlet, RouteParams, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService, SigninRegisterService } from '../../services/services';
import { AppComponent } from '../../app.component';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

function emailValidator(control) {
    if (!control.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return { 
            invalidEmail: true 
        };
    }
}

function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: ControlGroup): { [key: string]: any } => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
            return {
                mismatchedPasswords: true
            };
        }
    }
}

@Component({
    selector: 'register',
    directives: [RouterOutlet, RouterLink],
    styles: [require('../../../sass/register.scss').toString(), require('../../../css/animate.css').toString()],
    template: require('./register.component.html')
})
export class RegisterComponent {
    busy: boolean = false;
    shaking: boolean = false;
    checkingForDuplicateEmail: boolean = false;
    checkingForDuplicateUsername: boolean = false;
    emailInUse: boolean = false;
    usernameInUse: boolean = false;

    registerForm: ControlGroup;
    email: AbstractControl;
    username: AbstractControl;
    password: AbstractControl;
    repeatPassword: AbstractControl;

    private idpToken:string = '';

    constructor(
        public authenticationService: AuthenticationService, 
        public signinRegisterService: SigninRegisterService,
        private router: Router, 
        fb: FormBuilder,
        params:RouteParams) 
    {
        this.buildRegisterForm(fb, authenticationService);
    }


    buildRegisterForm(fb: FormBuilder, authenticationService: AuthenticationService)
    {
        this.registerForm = fb.group({
                "email": ["", emailValidator],
                "username": ["", Validators.required],
                "password": ["", Validators.required],
                "repeatPassword": ["", Validators.required]
            },
            { validator: matchingPasswords('password', 'repeatPassword') }
        );

        this.email = this.registerForm.controls['email'];
        this.username = this.registerForm.controls['username'];
        this.password = this.registerForm.controls['password'];
        this.repeatPassword = this.registerForm.controls['repeatPassword'];

        this.email.valueChanges
            .do((_) => {
                this.emailInUse = false;
                this.checkingForDuplicateEmail = true;
            })
            .debounceTime(500)
            .subscribe(
                (res: any) => {
                    if( res.indexOf('@') >= 0 )
                        authenticationService.isEmailOrUsernameInUse(res,
                            (inUse: boolean): void => { this.emailInUse = inUse },
                            (res: any) => AppComponent.generalError(res.status),
                            () => this.checkingForDuplicateEmail = false
                    )
                }
            );

         this.username.valueChanges
            .do((_) => {
                this.usernameInUse = false;
                this.checkingForDuplicateUsername = true;
            })
            .debounceTime(500)
            .subscribe(
                (res: any) => {
                    authenticationService.isEmailOrUsernameInUse(res,
                        (inUse: boolean): void => { this.usernameInUse = inUse },
                        (res: any) => AppComponent.generalError(res.status),
                        () => this.checkingForDuplicateUsername = false
                    )
                }
            );  
    }

    onSubmit(formValues: any) {
        // these properties really ought to be part of an async validator,
        // but the angular.io documentation on this topic is yet to be written
        if (this.registerForm.valid && !this.emailInUse && !this.usernameInUse) {
            this.busy = true;

            this.authenticationService
                .register(formValues.email, formValues.username, formValues.password,
                    () => {
                        this.busy = false;
                        this.signinRegisterService.resumeAfterSigninOrRegister();
                    },
                    (res: any) => {
                        if( res.status === 409 || res.status === 400 ) {
                            this.busy = false;
                            this.shakeForm();
                        } else {
                            AppComponent.generalError(res.status);
                        }
                    },
                    () => {
                        this.busy = false;
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
        }, 1000);
    }
}