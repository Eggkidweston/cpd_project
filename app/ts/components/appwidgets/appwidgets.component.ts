import { Component, Input } from '@angular/core';
import { AppWidgetComponent } from '../appwidget/appwidget.component';
import { StoreApp } from '../../models';
import { SearchPipe} from '../search/search-pipe';
import { NgForm } from '@angular/common';

@Component({
    selector: 'app-widgets',
    template: require('./appwidgets.component.html'),
    styles: [require('./appwidgets.scss').toString()],
    pipes: [SearchPipe],
    directives: [AppWidgetComponent]
})
export class AppWidgetsComponent {
    @Input() apps: Array<StoreApp>;
    @Input() term;
}