import { Component, Output, EventEmitter } from '@angular/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { ControlGroup, Control, FormBuilder, AbstractControl } from '@angular/common';
import { IdpMembers } from '../../models';
import { AppComponent } from '../../app.component';
import { IDPRegisterService, AuthenticationService, SigninRegisterService } from '../../services/services';

    @Component({
        selector: 'registeridp',
        template: require('./registeridp.component.html'),
        styles: [require('./registeridp.scss').toString()]
    })


    export class RegisterIDPComponent {

    	@Output() updateSearch = new EventEmitter();

	    public filteredList = [];
		public query = '';
	    public advancedSearchActive: boolean = false;
	    public idpLoaded:boolean = false;
	    public idpSelected:boolean = false;
	    public idpFound:boolean = false;
	    private results:Array<IdpMembers>;
	    private selectedIdp:IdpMembers;

	    public showPage:boolean = false;

	    public authenticated:boolean = false;

	    searchForm: ControlGroup;
	    searchterm: AbstractControl;
	    idpUserForm: ControlGroup;
	    username: AbstractControl;

	    checkingForDuplicateUsername: boolean = false;
	    usernameInUse: boolean = false;

	    constructor( private _idpRegisterService:IDPRegisterService,
                 fb: FormBuilder,
                 public authenticationService: AuthenticationService, 
        		public signinRegisterService: SigninRegisterService,
                  ) {

	  
	    	this.searchForm = fb.group({
	                "searchterm": [""]
	            });

		    this.searchterm = this.searchForm.controls['searchterm'];

		    this.idpUserForm = fb.group({
	                "username": [""]
	            });

		    this.username = this.idpUserForm.controls['username'];

	    	if(localStorage.getItem("pid")!='undefined'&&localStorage.getItem("pid")!=''&&localStorage.getItem("pid")!=null){

	    		//attempt to log in with the pidmail and password
	    		this.signIn()

	    	}else{
	    		this.showPage = true;
		        this.getIdpMembers();
	    	}
	    }
        
	    private getIdpMembers() {
        
            this._idpRegisterService.getIdpMembers()
                .subscribe(
                    results => {
                    	this.results = results;
                    	this.idpLoaded = true;
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
	    }

	    onSubmitIDP(formValues: any) {
	        if (this.idpUserForm.valid) {
	            this.authenticationService
                .registerWithLocalPid( formValues.username, 
                    () => {
						this.signinRegisterService.redirectToProfileAfterSignin();
                    },
                    (res: any) => {
                        AppComponent.generalError(res.status);
                    },
                    () => {
                        this.signIn();
                    }
                );
	        } else {
	            //this.shakeForm();
	        }
	    } 
	    
        
	    signIn() {
	    	
	    	this.authenticationService
                .signInWithPid(
                    () => {
                    	this.signinRegisterService.redirectToProfileAfterSignin();
						this.signinRegisterService.resumeAfterSigninOrRegister();
                    },
                    (res: any) => {
                    	this.showPage = true;
                        this.requireUsername();
                    },
                    () => {
                    	
                        
                    }
                );
	    }

	    requireUsername() {
	    	this.authenticated = true; 

			this.username.valueChanges
            .do((_) => {
                this.usernameInUse = false;
                this.checkingForDuplicateUsername = true;
            })
            .debounceTime(500)
            .subscribe(
                (res: any) => {
                    this.authenticationService.isEmailOrUsernameInUse(res,
                        (inUse: boolean): void => { this.usernameInUse = inUse },
                        (res: any) => AppComponent.generalError(res.status),
                        () => this.checkingForDuplicateUsername = false
                    )
                }
            );  
	    }

	    public searchTermChanged(searchTerm:string) {
	        if(searchTerm.length>1) {
	        	this.filteredList = [];
	        	for (let entry of this.results) {
	        		var entryName:string = entry.name.toUpperCase();
	        		if(entryName.indexOf(searchTerm.toUpperCase())>-1){
	        			this.filteredList.push(entry);
	        		}
	        	}
	        }else{
	        	this.filteredList = [];
	        }
	    }


	    public select(item:IdpMembers){
	    	this.query = item.name;
	    	this.filteredList = [];
	    	this.idpSelected = true;
	    	if(item.entityID!='') {
				this.idpFound = true;
				this.selectedIdp = item;
	    	} else {
	    		this.idpFound = false;
	    		this.selectedIdp = null;
	    	}
		}

		public launchIDP() {
			var url = `https://sp.data.alpha.jisc.ac.uk/Shibboleth.sso/Login?entityID=${this.selectedIdp.entityID}&target=https://sp.data.alpha.jisc.ac.uk/secure/auth-web.php?returl=` + encodeURIComponent(window.location.href);
			
        	window.location.href = url;
		}

		 hideOptions(){
	        setTimeout(() => {
	          this.filteredList = [];
	        }, 300);
	    }

    }   