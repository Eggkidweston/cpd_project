import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'pagination',
    template: require('./pagination.component.html'),
    styles: [require('./pagination.scss').toString()],
    inputs: ['totalPages']
})
export class PaginationComponent
{
    @Input() currentPage:number;
    @Output() pageClicked: EventEmitter<number> = new EventEmitter<number>();

    private range: Array<number>;
    private _totalPages: number;

    set totalPages(value:number) {
        this._totalPages = value;
        this.range = new Array<number>();
        for( var i = 1; i<=value; i++ ) this.range.push(i);
        //limit array to 5
        //this.range = this.range.slice(0,6);
    }

    get totalPages() {
        return this._totalPages;
    }

    onPageClicked(page) {
        this.pageClicked.emit(page);
    }

    onPreviousClicked() {
        this.pageClicked.emit(Math.max(1, this.currentPage-1));
    }

    onNextClicked() {
        this.pageClicked.emit(Math.min(this.totalPages, this.currentPage+1));
    }
}
