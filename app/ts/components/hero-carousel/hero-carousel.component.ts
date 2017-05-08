import { Component, Input } from '@angular/core';
import { StoreApp } from '../../models';
import { RouterLink } from '@angular/router-deprecated';
import { RatingComponent } from '../shared/rating/rating.component';
require('slick-carousel');
declare var $: any

@Component({
    selector: 'hero-carousel',
    template: require('./hero-carousel.component.html'),
    styles: [require('./hero-carousel.scss').toString()],
    directives: [RouterLink, RatingComponent]
})
export class HeroCarouselComponent {
    @Input() apps: Array<StoreApp>;
    public noimagestyle:string;
    public hasMedia: boolean;

    ngAfterViewInit() {
      $('.hero-carousel').slick({
        centerMode: true,
        slidesToShow: 3,
        centerPadding: '0',
        responsive: [
          {
            breakpoint: 992,
            settings: {
              centerMode: false,
              slidesToShow: 1,
            }
          },
        ]
      });
   }

   widgetTypeIcon(app:StoreApp):string
   {
     if(app.media && app.media.length > 0) {
       this.hasMedia = true;
     }
    if(!app.image) {
      return "backgroundimage" + app.type_id;
    }
    return "";
   }
}
