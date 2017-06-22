import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';
import { AuthenticationService, SigninRegisterService } from '../../services/services';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'signin',
    directives: [RouterOutlet, RouterLink],
    styles: [require('../signin/signin.scss').toString()],
    template: require('./reset-password.component.html'),
})
export class ResetPasswordComponent {
    resetPasswordToken: string;

    busy: boolean = false;
    shaking: boolean = false;

    resetPasswordForm: ControlGroup;
    confirmPassword: AbstractControl;
    password: AbstractControl;

    constructor(
        public authenticationService: AuthenticationService,
        public signinRegisterService: SigninRegisterService,
        private router: Router,
        fb: FormBuilder,
        params: RouteParams)
    {
        this.resetPasswordToken = params.get('token');

        this.resetPasswordForm = fb.group({
          "password": ["", Validators.required],
          "confirmPassword": ["", Validators.required],
        }, {validator: this.checkPasswordsMatch('password', 'confirmPassword')});

        this.password = this.resetPasswordForm.controls['password'];
        this.confirmPassword = this.resetPasswordForm.controls['confirmPassword'];
    }

    checkPasswordsMatch(password: string, confirmPassword: string) {
      return (group: ControlGroup) => {
        let passwordInput = group.controls[password];
        let passwordConfirmationInput = group.controls[confirmPassword];
        if (passwordInput.value !== passwordConfirmationInput.value) {
          return passwordConfirmationInput.setErrors({notEquivalent: true})
        }
      }
    }

    onSubmit(formValues: any) {
        if (this.resetPasswordForm.valid) {
            this.busy = true;

            this.authenticationService
                .resetPassword(this.resetPasswordToken, formValues.password,
                () => {
                    this.busy = false;
                    this.router.navigate(['Profile']);
                },
                (res: any) => {
                    this.busy = false;
                    this.shakeForm();
                }
                );
        } else {
            this.shakeForm();
        }
    }


    shakeForm() {
        this.shaking = true;
        setTimeout(() => {
            this.shaking = false;
        }, 500);
    }
}
