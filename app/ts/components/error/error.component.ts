import {Component, OnInit} from 'angular2/core';
import { RouteParams, RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

@Component({
  selector: 'error',
  directives: [RouterOutlet, RouterLink],
  styles: [require('../../../sass/error.scss').toString()],
  template: require('./error.component.html')
})
export class ErrorComponent implements OnInit {
    private status;
    
    constructor( private routeParams: RouteParams ) {
    }
    
    ngOnInit() {
        this.status = this.routeParams.get('status');
    }
}   