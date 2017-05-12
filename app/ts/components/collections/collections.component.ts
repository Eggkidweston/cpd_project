import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';

import {
    RouterOutlet,
    RouterLink,
    RouteConfig,
    RouteParams,
    Router,
    ROUTER_DIRECTIVES
} from '@angular/router-deprecated';
import {AuthenticationService} from '../../services/services';
import {AppsService} from '../../services/services';
import {StoreApp, TagCloud, Tag, Collection} from '../../models';
import {AppComponent} from '../../app.component';
import {AppWidgetsComponent} from '../appwidgets/appwidgets.component';


@Component({
    selector: 'collections',
    template: require('collections.component.html'),
    styles: [require('../../../sass/explore.scss').toString()],
    directives: [AppWidgetsComponent, RouterOutlet, RouterLink]
})
export class CollectionsComponent {
    @Output() collectionAdded: EventEmitter<Collection> = new EventEmitter<Collection>();

    newCollectionForm: ControlGroup;
    collectionTitle: AbstractControl;
    collectionDescription: AbstractControl;
    busy: boolean = false;
    collectionId: number = 1;

    constructor(private appsService: AppsService, fb: FormBuilder) {
        this.newCollectionForm = fb.group({
            "collectionTitle": ["", Validators.required],
            "collectionDescription": ["", Validators.required]
        });

        this.collectionTitle = this.newCollectionForm.controls['collectionTitle'];
        this.collectionDescription = this.newCollectionForm.controls['collectionDescription'];
    }

    ngAfterViewInit() {

    }

    onSubmit(formVaules: any) {
        if( this.newCollectionForm.valid ) {
            this.busy = true;

            let collection = new Collection(this.collectionTitle.value, this.collectionDescription.value);

            this.appsService.submitCollection(collection,
                (collection) => {
                    this.busy = false;
                    this.collectionAdded.emit(collection);
                },
                (err) => {
                    this.busy = false;
                }
            );
        }
    }

}
