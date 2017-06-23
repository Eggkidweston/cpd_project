import { Component, Input } from '@angular/core';
import { StoreApp } from '../../../../models';
import { AppsService } from '../../../../services/services';
import {AppComponent} from '../../../../app.component';

require("../../../../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js");

@Component({
    selector: 'preview',
    template: require('./preview.component.html'),
    styles: [require('./preview.scss').toString()]
})

export class PreviewComponent {
    @Input() resource: StoreApp;
    private selectedImage: number = 0;
    private imageSelected: boolean;
    private youtubeSelected: boolean;
    private livePreviewSelected: boolean;
    private livePreviewUrl: string;

    constructor(public appsService:AppsService) {}

    ngOnInit() {
        if(this.resource.media.length > 0) {
            this.imageSelected = true;
            return;
        } else if (this.resource.trialurl) {
            this.livePreviewSelected = true;
        } else {
            this.youtubeSelected = true;
        }
    }

    ngAfterViewInit() {
        if(this.resource.trialurl) {
            this.checkLivePreviewUrl( this.resource.trialurl );
        }
    }

    switchCurrentPreview(previewType: string, clickedImageIndex: number = null) {
        switch(previewType) {
            case "Image":
                this.disableAllPreviews(clickedImageIndex);
                this.imageSelected = true;
                break;
            case "Youtube":
                this.disableAllPreviews(clickedImageIndex);
                this.youtubeSelected = true;
                break;
            case "LivePreview":
                this.disableAllPreviews(clickedImageIndex);
                this.livePreviewSelected = true;
                break;
        }
    }

    disableAllPreviews(clickedImageIndex: number){
        this.youtubeSelected = false;
        this.livePreviewSelected = false;
        this.imageSelected = false;
        this.selectedImage = clickedImageIndex;
    }

    extractYoutubeId(fullUrl) {
        if( !fullUrl ) return '';
        var idSeparator = fullUrl.lastIndexOf('=');
        if( idSeparator==-1 ) idSeparator = fullUrl.lastIndexOf('/');
        return fullUrl.substr(idSeparator + 1);
    }

    checkLivePreviewUrl( livePreviewUrl )
    {
        this.appsService.verifyTrialUrl( livePreviewUrl )
            .subscribe(
                response =>
                {
                    if(response.status === 200) {
                       this.livePreviewUrl = livePreviewUrl;
                    }
                },
                ( error:any ) => this.livePreviewUrl = null
            );
    }
}
