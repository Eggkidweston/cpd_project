import { Component } from 'angular2/core';

    @Component({
        selector: 'about',
        template: require('./about.component.html'),
        styles: [require('../../../sass/about.scss').toString()]
    })

    export class AboutComponent {
        
    }   