import { Component, Input } from 'angular2/core';
import { NgFor } from 'angular2/common';
import { StoreApp } from '../../models';

require("../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'media-carousel',
    template: require('./media-carousel.component.html'),
    styles: [require('../../../sass/media-carousel.scss').toString()]
})
export class MediaCarouselComponent {
    @Input() resource: StoreApp;
}