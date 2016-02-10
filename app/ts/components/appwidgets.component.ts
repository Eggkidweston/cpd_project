import {Component} from 'angular2/core';
import { AppWidgetComponent } from './appwidget.component';

@Component({
  selector: 'app-widgets',
  template: require('./appwidgets.component.html'),
  directives: [AppWidgetComponent]
})
export class AppWidgetsComponent {
}