import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { StoreApp } from '../../models';
import { ShadowApp } from '../../models';

require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'media-carousel',
    template: require('./media-carousel.component.html'),
    styles: [require('../../../sass/media-carousel.scss').toString()]
})

export class MediaCarouselComponent {
    @Input() resource: ShadowApp;
    private selectedMedium: number = 0;

    mediumSelected(i: number) {
        this.selectedMedium = i;
    }
}