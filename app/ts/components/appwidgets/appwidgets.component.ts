import { Component } from 'angular2/core';
import { AppWidgetComponent } from '../appwidget/appwidget.component';

@Component({
    selector: 'app-widgets',
    template: require('./appwidgets.component.html'),
    styles: [require('../../../sass/appwidgets.scss').toString()],
    directives: [AppWidgetComponent]
})
export class AppWidgetsComponent {
}