import { Component } from '@angular/core';
import { appSettings } from '../../../../../settings';

@Component( {
    selector: 'curation-bar',
    template: require( './curation-bar.component.html' ),
    styles: [ require( './curation-bar.scss' ).toString()]
} )
export class CurationBarComponent
{
    goCuration()
    {
      var url = `${appSettings.curationRoot}`;
      window.open(url,'_blank');
    }
}
