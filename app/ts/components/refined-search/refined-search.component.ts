import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'refined-search',
    styles: [require('./refined-search.scss').toString()],
    template: require('./refined-search.component.html')
})
export class RefinedSearchComponent {
    @Output() refinedSearchUpdated: EventEmitter<any> = new EventEmitter();
    private resourceUseType: string;
    private resourceSubject: string;
    private resourceLevel: string;

    ngOnInit(){
        this.resourceUseType = this.getStoredValue('resource-usetype');
        this.resourceSubject = this.getStoredValue('resource-subject');
        this.resourceLevel = this.getStoredValue('resource-level');
    }

    getStoredValue(category){
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem(category);
        }
    }

    update(category, value){
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(category, value);
        }

        //ping off a new search
        this.refinedSearchUpdated.emit(null);
    }
}
