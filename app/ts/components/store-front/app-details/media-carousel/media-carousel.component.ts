import { Component, Input } from '@angular/core';
import { StoreApp } from '../../../../models';

require("../../../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'media-carousel',
    template: require('./media-carousel.component.html'),
    styles: [require('./media-carousel.scss').toString()]
})

export class MediaCarouselComponent {
    @Input() resource: StoreApp;
    private selectedMedium: number = 0;
    private youtubeSelected: boolean = false;

    onMediumClicked(i: number) {
        this.selectedMedium = i;
        this.youtubeSelected = false;
    }

    onYoutubeClicked() {
        this.youtubeSelected = true;
    }

    extractYoutubeId(fullUrl) {
        if( !fullUrl ) return '';
        var idSeparator = fullUrl.lastIndexOf('=');
        if( idSeparator==-1 ) idSeparator = fullUrl.lastIndexOf('/');
        return fullUrl.substr(idSeparator + 1);
    }
}