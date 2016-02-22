import { Component, AfterViewInit, ViewChild } from 'angular2/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from 'angular2/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

    // var jQuery: any = require("jquery");
    // require('../../../js/jquery.icheck.min.js');
    // require('../../../css/checkbox/orange.css');

@Component({
  selector: 'signin',
  directives: [RouterOutlet, RouterLink],
  styles: [require('../../../sass/signin.scss').toString()],
  template: require('./signin.component.html')
})
export class SignInComponent implements AfterViewInit {
    @ViewChild('rememberMeElement') rememberMeElement;

    signinForm: ControlGroup;
    emailOrUsername: AbstractControl;
    password: AbstractControl;
    rememberMe: AbstractControl;
    
    constructor(fb: FormBuilder) {
        this.signinForm = fb.group({
            "emailOrUsername": ["", Validators.required], 
            "password": ["", Validators.required],
            "rememberMe": ["", Validators.required]
            }
        );

        this.emailOrUsername = this.signinForm.controls['emailOrUsername'];
        this.password = this.signinForm.controls['password'];
        this.rememberMe = this.signinForm.controls['rememberMe'];
    }

    ngAfterViewInit() {
        // nasty legacy stuff
        // jQuery(this.rememberMeElement.nativeElement).iCheck({
        //     checkboxClass: 'icheckbox_minimal-orange',
        //     radioClass: 'iradio_minimal-orange',
        //     increaseArea: '20%'
        // });    
    }
}
