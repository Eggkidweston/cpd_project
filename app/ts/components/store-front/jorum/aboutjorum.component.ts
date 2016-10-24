import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component( {
    selector: 'aboutjorum',
    template: require( './aboutjorum.component.html' ),
    styles: [ require( './aboutjorum.scss' ).toString()],
    directives: [RouterOutlet, RouterLink]
} )
export class AboutJorumComponent
{
    private resourceId:number;

    constructor( params:RouteParams, 
                 public router:Router)
    {
        this.resourceId = +params.get( 'id' );
    }

    goBack()
    {
        this.router.navigate( ['AppDetails', { id: this.resourceId }] );
    }

    openSignIn()
    {
        this.router.navigate( ['SignIn'] );
    }

}   