import { Component } from '@angular/core';

@Component( {
    selector: 'terms',
    template: require( './terms.component.html' ),
    styles: [ require( './terms.scss' ).toString()]
} )
export class TermsComponent
{
    private resourceId:number;

    constructor( )
    {
      
    }

}   