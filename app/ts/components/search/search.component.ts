import { Component } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { AppComponent } from '../../app.component';


@Component({
    selector: 'search',
    directives: [RouterOutlet, RouterLink],
    styles: [require('../../../sass/search.scss').toString()],
    template: require('./search.component.html')
})
export class SearchComponent {
    

}