import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RouterOutlet, RouterLink, RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { AuthenticationService } from '../../../services/services';
import { AppsService } from '../../../services/services';
import { StoreApp, TagCloud, Tag, Collection } from '../../../models';
import { AppComponent } from '../../../app.component';
import { AppWidgetsComponent } from '../../appwidgets/appwidgets.component';

@Component({
    selector: 'submit-collection',
    template: require('submit-collection.component.html'),
    styles: [require('../../../../sass/explore.scss').toString(), require('../../search/search.scss').toString()],
    directives: [AppWidgetsComponent]
})
export class SubmitCollectionComponent {
    @Output() collectionAdded: EventEmitter<Collection> = new EventEmitter<Collection>();
    public searchResults = [];
    public resources:Array<StoreApp>;
    public usersCollections:Array<Collection> = [];

    private resourceIds = [];
    private searchingForResources: boolean = false;
    private activeOnly: boolean = true;
    private editingCollection: boolean = false;
    private editingCollectionID: number;

    newCollectionForm: ControlGroup;
    collectionTitle: AbstractControl;
    collectionDescription: AbstractControl;
    searchterm: AbstractControl;

    busy: boolean = false;
    collectionId: number = 1;

    constructor(private appsService: AppsService, private fb: FormBuilder) {
        this.createForm();
    }

    createForm(title?, description?) {
      this.newCollectionForm = this.fb.group({
          "collectionTitle": [title, Validators.required],
          "collectionDescription": [description, Validators.required],
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

    ngAfterViewInit() {
        this.loadExistingCollections();
    }

    loadExistingCollections()
    {
        this.appsService.getCollectionsByCreator( AuthenticationService.user.id )
            .subscribe(
                usersCollections => {
                    this.usersCollections = usersCollections;
                },
                ( error:any ) => AppComponent.generalError( error.status )
            );
    }

    onSubmit(formVaules: any) {
        if( this.newCollectionForm.valid ) {
            this.busy = true;
            let collection = new Collection(this.collectionTitle.value, this.collectionDescription.value, this.resourceIds, null);

            this.appsService.submitCollection(collection,
                (result) => {
                    this.busy = false;
                    this.collectionAdded.emit(result.collection);
                    this.usersCollections.push(result.collection);
                    this.resetForm();
                },
                (err) => {
                    this.busy = false;
                }
            );
        }
    }

    updateCollection(e){
        e.preventDefault()

        if( this.newCollectionForm.valid ) {
            this.busy = true;
            let collection = new Collection(this.collectionTitle.value, this.collectionDescription.value, this.resourceIds, null);
            this.appsService.updateCollection(this.editingCollectionID, collection,
                (result) => {
                    this.busy = false;
                    this.editingCollection = false;
                    this.collectionAdded.emit(result.collection);
                    this.loadExistingCollections();
                    this.resetForm();
                },
                (err) => {
                    this.busy = false;
                }
            );
        }
    }

    cancelUpdate(e){
        e.preventDefault();
        this.editingCollection = false;
        this.editingCollectionID = null;
        this.resetForm();
    }

    deleteCollection(collection: Collection){
        this.appsService.deleteCollection( collection.id,
            (status) => {
                let index = this.usersCollections.indexOf(collection);
                this.usersCollections.splice(index, 1);
            },
            (error:any) => AppComponent.generalError( error.status )
            );
    }

    editCollection(collection: Collection){
        this.searchResults = [];
        this.editingCollection = true;
        this.editingCollectionID = collection.id;
        this.createForm(collection.title, collection.description);
        this.resourceIds = collection.resourceids;
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
        if (this.resourceIds.indexOf(item.id) === -1){
            this.resourceIds.push(item.id);
        } else {
            let index = this.resourceIds.indexOf(item.id);
            this.resourceIds.splice(index, 1);
        }
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

    resourceInCollection(resourceId: number){
        return this.resourceIds.indexOf(resourceId) !== -1;
    }

    resetForm(){
      this.searchResults = [];
      this.resourceIds = [];
      this.createForm();
    }

}
