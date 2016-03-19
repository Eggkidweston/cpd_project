import { Component, Input, AfterViewInit } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { FileUploader } from '../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../thirdparty/file-upload/file-select';
import { StoreApp } from '../../models';
import { AppComponent } from '../../app.component';
import { TagComponent } from '../tag/tag.component';
import { AppsService } from '../../services/services';
import { AuthenticationService, TagsService } from '../../services/services';
import { appSettings } from '../../services/services';

@Component({
    selector: 'app-edit',
    template: require('./appedit.component.html'),
    styles: [require('../../../sass/appedit.scss').toString()],
    directives: [FileDrop, FileSelect, TagComponent]
})
export class AppEditComponent implements AfterViewInit {
    private app: StoreApp;
    private resourceId: number;
    private uploader: FileUploader;
    private hasBaseDropZoneOver: boolean = false;
    private hasAnotherDropZoneOver: boolean = false;
    public sourceTags: Array<string>;

    constructor(
        public appsService: AppsService,
        public authenticationService: AuthenticationService,
        public tagsService: TagsService,
        params: RouteParams) {
        this.resourceId = +params.get('id');
        this.uploader = new FileUploader({
            url: `${appSettings.apiRoot}resources/${this.resourceId}/edit`,
            resourceId: this.resourceId,
            accessToken: authenticationService.apiKey
        });
    }

    ngAfterViewInit() {
        this.loadApp();
        this.loadSourceTags();
    }

    loadApp() {
        this.appsService.getAppDetails(this.resourceId)
            .subscribe(
            storeApp => this.app = storeApp,
            (error: any) => AppComponent.generalError(error.status)
            )
    }

    loadSourceTags() {
        this.tagsService.getAllTags()
            .subscribe(
            allTags => this.sourceTags = allTags,
            (error: any) => AppComponent.generalError(error.status)
            )
    }
    
    // would be nice to use the RxJS library to do this
    addTag(tagName: string) {
        this.app.tags.push(tagName);
    }
    
    removeTag(tagName: string) {
        var index = this.app.tags.indexOf(tagName, 0);
        if (index > -1) {
            this.app.tags.splice(index, 1);
        }
    }

    private fileOverBase(e: any) {
        this.hasBaseDropZoneOver = e;
    }

    private fileOverAnother(e: any) {
        this.hasAnotherDropZoneOver = e;
    }
}