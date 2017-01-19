import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../services/services';

@Component( {
    selector: 'ctm',
    template: require( 'ctm.component.html' ),
    directives: [RouterOutlet, RouterLink]
} )

export class CurationTokenMigrationComponent
{

    constructor( public authenticationService:AuthenticationService,
                 public router:Router,
                 params:RouteParams )
    {

        let resourceId = params.get( 'id' );
        let decodedToken = params.get('token');
        
        if(resourceId!=null&&decodedToken!=null){
            decodedToken = decodeURIComponent(decodedToken);
            if(!this.authenticationService.userSignedIn()) {
                if(decodedToken){
                    this.authenticationService.signInWithToken(decodedToken,() => {
                        this.router.navigate( ['AppDetails', { id: resourceId }] );
                    },
                    (res: any) => {
                        this.router.navigate( ['SignIn'] );
                    }
                );
                }else{
                    this.router.navigate( ['Home'] );
                }
            }else{
                if(decodedToken!=''){
                    this.router.navigate( ['AppDetails', { id: resourceId }] );
                }
            }
        }else{
            this.router.navigate( ['Home'] );
        }

    }
    
}