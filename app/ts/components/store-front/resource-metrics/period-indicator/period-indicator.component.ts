import { Component, Input } from '@angular/core';

@Component({
    selector: 'period-indicator',
    template: require('./period-indicator.component.html'),
    styles: [require('./period-indicator.component.scss').toString()]
})
export class PeriodIndicator {
    @Input() thisPeriod: number;
    @Input() previousPeriod: number;
}