import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tag',
  template: require('./tag.component.html'),
  styles: [require('../../../sass/tag.scss').toString()]
})
export class TagComponent {
    @Input() tagName: string;
    @Input() isSourceTag: boolean;
    @Output() tagClicked = new EventEmitter();
    
    onClick() {
        this.tagClicked.emit(this.tagName);
    }
}