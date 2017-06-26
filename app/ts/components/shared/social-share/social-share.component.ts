import { Component, Input } from '@angular/core';
import { WindowRef } from '../../../services/window.service';

@Component({
    selector: 'social-share',
    template: require('./social-share.component.html'),
    styles: [require('./social-share.scss').toString()],
    providers: [WindowRef],
})

export class SocialShareComponent {
    @Input() title: string;
    @Input() description: string;

    constructor(private winRef: WindowRef) {

        let addthis = winRef.nativeWindow.addthis;
        if(addthis.layers.refresh){
            addthis.layers.refresh();
        }
    }
}
