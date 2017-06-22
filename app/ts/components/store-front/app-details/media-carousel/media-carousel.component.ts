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
    private selectedImage: number = 0;
    private imageSelected: boolean;
    private youtubeSelected: boolean;
    private livePreviewSelected: boolean;
    private livePreviewUrl: string;


    ngOnInit() {
        if(this.resource.trialurl) {
            this.checkLivePreviewUrl( this.resource.trialurl );
        }

        if(this.resource.media.length > 0) {
            this.imageSelected = true;
            return;
        } else if (this.resource.trialurl) {
            this.livePreviewSelected = true;
        } else {
            this.youtubeSelected = true;
        }
    }

    switchCurrentPreview(previewType: string, clickedImageIndex: number = null) {
        switch(previewType) {
            case "Image":
                this.disableAllPreviews();
                this.imageSelected = true;
                this.selectedImage = clickedImageIndex;
                break;
            case "Youtube":
                this.disableAllPreviews();
                this.youtubeSelected = true;
                break;
            case "LivePreview":
                this.disableAllPreviews();
                this.livePreviewSelected = true;
                break;
        }
    }

    disableAllPreviews(){
        this.youtubeSelected = false;
        this.livePreviewSelected = false;
        this.imageSelected = false;
    }

    extractYoutubeId(fullUrl) {
        if( !fullUrl ) return '';
        var idSeparator = fullUrl.lastIndexOf('=');
        if( idSeparator==-1 ) idSeparator = fullUrl.lastIndexOf('/');
        return fullUrl.substr(idSeparator + 1);
    }

    checkLivePreviewUrl( livePreviewUrl )
    {

        this.livePreviewUrl = livePreviewUrl;

    }
}
