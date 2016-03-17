import { Component, Input, AfterViewInit } from 'angular2/core';
import { RouterOutlet, RouterLink, RouteConfig, RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { FileUploader } from '../../thirdparty/file-upload/file-uploader';
import { FileDrop } from '../../thirdparty/file-upload/file-drop';
import { FileSelect } from '../../thirdparty/file-upload/file-select';
import { StoreApp } from '../../models';
import { AppComponent } from '../../app.component';
import { AppsService } from '../../services/services';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
    selector: 'app-edit',
    template: require('./appedit.component.html'),
    styles: [require('../../../sass/appedit.scss').toString()],
    directives: [ FileDrop, FileSelect ]
})
export class AppEditComponent implements AfterViewInit {
    private app: StoreApp;
    private resourceId: number;
    private uploader: FileUploader = new FileUploader({ url: URL });
    private hasBaseDropZoneOver: boolean = false;
    private hasAnotherDropZoneOver: boolean = false;

    private fileOverBase(e: any) {
        this.hasBaseDropZoneOver = e;
    }

    private fileOverAnother(e: any) {
        this.hasAnotherDropZoneOver = e;
    }

    constructor(
        public appsService: AppsService,
        params: RouteParams) {
        this.resourceId = +params.get('id');
    }

    ngAfterViewInit() {
        this.loadApp();
    }

    loadApp() {
        this.appsService.getAppDetails(this.resourceId)
            .subscribe(
            storeApp => this.app = storeApp,
            (error: any) => AppComponent.generalError(error.status)
            );
    }
}