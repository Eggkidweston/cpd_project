import {Component} from 'angular2/core';
import { AppWidgetsComponent } from './appwidgets.component';

@Component({
  selector: 'home',
  template: require('./home.component.html'),
  directives: [AppWidgetsComponent]
})
export class HomeComponent {
}   