import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../services/services';
import { AppsService } from '../../services/services';
import { StoreApp, TagCloud, Tag, Collection } from '../../models';
import { AppComponent } from '../../app.component';
import { AppWidgetsComponent } from '../appwidgets/appwidgets.component';

@Component({
    selector: 'collections',
    template: require('collections.component.html'),
    styles: [require('../../../sass/explore.scss').toString(), require('../search/search.scss').toString()],
    directives: [AppWidgetsComponent]
})
export class CollectionsComponent {
    @Output() collectionAdded: EventEmitter<Collection> = new EventEmitter<Collection>();
    public searchResults = [];
    private searchingForResources: boolean = false;
    private activeOnly: boolean = true;

    newCollectionForm: ControlGroup;

    collectionTitle: AbstractControl;
    collectionDescription: AbstractControl;
    searchterm: AbstractControl;

    busy: boolean = false;
    collectionId: number = 1;

    constructor(private appsService: AppsService, fb: FormBuilder) {
        this.newCollectionForm = fb.group({
            "collectionTitle": ["", Validators.required],
            "collectionDescription": ["", Validators.required],
            "searchterm": [""],
        });

        this.collectionTitle = this.newCollectionForm.controls['collectionTitle'];
        this.collectionDescription = this.newCollectionForm.controls['collectionDescription'];
        this.searchterm = this.newCollectionForm.controls['searchterm'];

        this.searchterm.valueChanges
            .do((_) => {
              this.searchingForResources = true;
            })
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(
                (res: any) => {
                    this.searchTermChanged(this.searchterm.value, this.activeOnly);
                }
            );
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

    onSubmitSearch(formValues: any) {
        this.searchTermChanged(this.searchterm.value, this.activeOnly);
    }

    searchTermChanged(searchTerm, activeOnly) {
        if(searchTerm && searchTerm.length>1) {
            this.appsService.getBySearch(searchTerm, "", activeOnly)
                .subscribe(
                    searchResults => {
                        if(this.searchingForResources) {
                            this.searchResults = searchResults.data;
                            this.searchingForResources = false;
                        }
                    },
                    (error:any) => AppComponent.generalError( error.status )
                );
        } else {
          this.searchResults = [];
        }
    }

    select(item){
        console.log('add this resource to collection', item.id);
    }

    itemimage(item):string {
        if(!item.image) {
            var type = item.type_id;
            if(type==99){
                type = 'other';
            }
            return 'https://s3-eu-west-1.amazonaws.com/jisc-store-assets/icontype' + type + '.png';
        }
        return item.image;
    }

    itemTypeClass(item):string {
      var type = item.type_id;
      if(type==99){
          type = 'other';
      }
      return 'backgroundimage' + type;
    }

    shortTitle(appTitle: String) {
       return (appTitle.length>80) ? (appTitle.substr(0, 80)+'...') : appTitle;
    }

    shortDescription(appDescription: String) {
       return (appDescription.length>110) ? (appDescription.substr(0, 110)+'...') : appDescription;
    }

}
